package com.emobility.api.controller

import com.emobility.api.repository.UserRepository
import com.emobility.api.model.User
import com.emobility.api.security.JwtUtils
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/auth")
class AuthController(
    private val authenticationManager: AuthenticationManager,
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtUtils: JwtUtils
) {

    @PostMapping("/login")
fun authenticateUser(@Valid @RequestBody loginRequest: LoginRequest): ResponseEntity<*> {
    try {
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(loginRequest.username, loginRequest.password)
        )
        SecurityContextHolder.getContext().authentication = authentication
        val jwt = jwtUtils.generateJwtToken(authentication.principal as org.springframework.security.core.userdetails.UserDetails)
        return  ResponseEntity.ok(JwtResponse(jwt))
    } catch (e: Exception) {
        return ResponseEntity.badRequest().body(mapOf("error" to e.message))
    }
}

    @PostMapping("/register")
    fun registerUser(@Valid @RequestBody signUpRequest: SignUpRequest): ResponseEntity<*> {
       try {
            if (userRepository.existsByUsername(signUpRequest.username)) {
                // json response
                return ResponseEntity.badRequest().body(mapOf("error" to "Username is already taken!"))
            }

            val user = User(
                username = signUpRequest.username,
                password = passwordEncoder.encode(signUpRequest.password),
                roles = signUpRequest.roles.map { it.name }.toSet()
            )

            userRepository.save(user)

            // return as JSON object
            return ResponseEntity.ok(mapOf("message" to "User registered successfully!"))
        }
       catch (e: Exception) {
           return ResponseEntity.badRequest().body(mapOf("error" to e.message))
       }
    }

    @GetMapping("/alive")
    fun aliveStatus(): ResponseEntity<Map<String, String>> {
        return ResponseEntity.ok(mapOf("status" to "alive"))
    }

    data class LoginRequest(
        val username: String,
        val password: String
    )

    data class SignUpRequest(
        val username: String,
        val password: String,
        val roles: Set<Role>
    )

    data class JwtResponse(
        val token: String
    )

    enum class Role {
        ROLE_USER, ROLE_ADMIN
    }
}
