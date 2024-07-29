package com.emobility.api.controller

import com.emobility.api.model.ChargeDataRecord
import com.emobility.api.service.ChargeDataRecordService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/charge-data-records")
class ChargeDataRecordController(
    private val chargeDataRecordService: ChargeDataRecordService
) {

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun createChargeDataRecord(@RequestBody chargeDataRecord: ChargeDataRecord): ResponseEntity<Any> {
        return try {
            val createdRecord = chargeDataRecordService.createChargeDataRecord(chargeDataRecord)
            ResponseEntity.ok(createdRecord)
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    fun getChargeDataRecordById(@PathVariable id: UUID): ChargeDataRecord? {
        return chargeDataRecordService.getChargeDataRecordById(id)
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    fun getAllChargeDataRecords(): List<ChargeDataRecord> {
        return chargeDataRecordService.getAllChargeDataRecords()
    }


}
