package com.emobility.api.repository

import com.emobility.api.model.ChargeDataRecord

interface ChargeDataRecordRepositoryCustom {
    fun findTopByVehicleIdOrderByEndTimeDesc(vehicleId: String): ChargeDataRecord?
}