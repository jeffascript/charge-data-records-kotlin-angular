package com.emobility.api.service

import com.emobility.api.model.ChargeDataRecord
import java.util.*

interface ChargeDataRecordService {
    fun createChargeDataRecord(chargeDataRecord: ChargeDataRecord): ChargeDataRecord
    fun getChargeDataRecordById(id: UUID): ChargeDataRecord?
    fun getAllChargeDataRecords(): List<ChargeDataRecord>
}