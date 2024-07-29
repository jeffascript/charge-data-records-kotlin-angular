package com.emobility.api.model

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.*


@Entity
@Table(name = "charge_data_record")
data class ChargeDataRecord (
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @Column(nullable = false)
    val chargingSessionId: String,

    @Column(nullable = false)
    val vehicleId: String,

    @Column(nullable = false)
    val startTime: LocalDateTime,

    @Column(nullable = false)
    val endTime: LocalDateTime,

    @Column(nullable = false)
    val totalCost: BigDecimal

)