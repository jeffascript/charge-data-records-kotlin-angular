package com.emobility.api.service

import com.emobility.api.model.ChargeDataRecord
import com.emobility.api.repository.ChargeDataRecordRepository
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.util.*

@Service
class ChargeDataRecordServiceImpl(
    private val chargeDataRecordRepository: ChargeDataRecordRepository
) : ChargeDataRecordService {

    override fun createChargeDataRecord(chargeDataRecord: ChargeDataRecord): ChargeDataRecord {
        // Validate the charge data record
        require(chargeDataRecord.endTime.isAfter(chargeDataRecord.startTime)) {
            "End time must be after start time"
        }

        val lastRecord = chargeDataRecordRepository.findTopByVehicleIdOrderByEndTimeDesc(chargeDataRecord.vehicleId)
        if (lastRecord != null) {
            require(chargeDataRecord.startTime.isAfter(lastRecord.endTime)) {
                "Start time must be after the end time of the previous record for the same vehicle"
            }
        }

        require(chargeDataRecord.totalCost > BigDecimal.ZERO) {
            "Total cost must be greater than zero"
        }

        return chargeDataRecordRepository.save(chargeDataRecord)
    }

    override fun getChargeDataRecordById(id: UUID): ChargeDataRecord? {
        return chargeDataRecordRepository.findById(id).orElse(null)
    }

    override fun getAllChargeDataRecords(): List<ChargeDataRecord> {
        return chargeDataRecordRepository.findAll()
    }
}
