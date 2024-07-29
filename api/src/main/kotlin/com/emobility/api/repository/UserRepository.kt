package com.emobility.api.repository


import com.emobility.api.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.util.*

interface UserRepository : JpaRepository<User, UUID> {
    fun findByUsername(username: String): User?

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.username = :username")
    fun existsByUsername(username: String): Boolean
}
