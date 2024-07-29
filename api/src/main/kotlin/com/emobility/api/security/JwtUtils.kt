package com.emobility.api.security

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import jakarta.annotation.PostConstruct
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.security.Key
import java.util.*

@Component
class JwtUtils {
    private lateinit var jwtSecret: Key

    @PostConstruct
    fun init() {
        jwtSecret = Keys.secretKeyFor(SignatureAlgorithm.HS512)
    }

    fun generateJwtToken(userDetails: UserDetails): String {
        val claims = Jwts.claims().setSubject(userDetails.username)
        claims["roles"] = userDetails.authorities.map { it.authority }

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(Date())
            .setExpiration(Date(System.currentTimeMillis() + 86400000)) // 1 day
            .signWith(jwtSecret)
            .compact()
    }

    fun validateJwtToken(authToken: String): Boolean {
        try {
            Jwts.parserBuilder().setSigningKey(jwtSecret).build().parseClaimsJws(authToken)
            println("JWT token is valid, \n ===> token:  $authToken ")
            return true
        } catch (e: Exception) {
            // Handle various JWT exceptions
            println(e.message)
        }

        return false
    }

    fun getUserNameFromJwtToken(token: String): String {
        val user = Jwts.parserBuilder().setSigningKey(jwtSecret).build().parseClaimsJws(token).body.subject
        println("USER is valid, \n ===> token:  $user ")
        return user
    }
}