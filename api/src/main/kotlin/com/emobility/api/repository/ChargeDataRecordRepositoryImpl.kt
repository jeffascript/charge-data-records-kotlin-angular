package com.emobility.api.repository

import com.emobility.api.model.ChargeDataRecord
import jakarta.persistence.EntityManager
import org.springframework.stereotype.Repository

@Repository
class ChargeDataRecordRepositoryImpl(
    private val entityManager: EntityManager
) : ChargeDataRecordRepositoryCustom {

    override fun findTopByVehicleIdOrderByEndTimeDesc(vehicleId: String): ChargeDataRecord? {
        val query = entityManager.createQuery(
            "SELECT c FROM ChargeDataRecord c WHERE c.vehicleId = :vehicleId ORDER BY c.endTime DESC",
            ChargeDataRecord::class.java
        )
        query.setParameter("vehicleId", vehicleId)
        query.maxResults = 1

        return query.resultList.firstOrNull()
    }
}