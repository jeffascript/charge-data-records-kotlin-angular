package com.emobility.api.model
import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @Column(nullable = false, unique = true)
    val username: String,

    @Column(nullable = false)
    val password: String,

    @Column(nullable = false)
    @ElementCollection(fetch = FetchType.EAGER)
    val roles: Set<String>
)
