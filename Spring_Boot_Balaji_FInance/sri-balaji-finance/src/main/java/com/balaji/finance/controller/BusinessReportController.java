package com.balaji.finance.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.balaji.finance.pojo.BusinessReportResponsePojo;
import com.balaji.finance.service.BusinessReportService;

@RestController
@RequestMapping("/business-report")
public class BusinessReportController {

    @Autowired
    private BusinessReportService businessReportService;

    @GetMapping
    public ResponseEntity<List<BusinessReportResponsePojo>> getBusinessReport(

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate,

            @RequestParam(required = false)
            BigDecimal percentage) {

        List<BusinessReportResponsePojo> response =
                businessReportService.getBusinessReport(
                        fromDate,
                        toDate,
                        percentage);

        return ResponseEntity.ok(response);
    }
}