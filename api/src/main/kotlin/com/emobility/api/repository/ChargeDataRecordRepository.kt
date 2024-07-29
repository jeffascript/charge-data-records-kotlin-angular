package com.emobility.api.repository

import com.emobility.api.model.ChargeDataRecord
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface ChargeDataRecordRepository : JpaRepository<ChargeDataRecord, UUID>{

    fun findTopByVehicleIdOrderByEndTimeDesc(vehicleId: String): ChargeDataRecord?
}
