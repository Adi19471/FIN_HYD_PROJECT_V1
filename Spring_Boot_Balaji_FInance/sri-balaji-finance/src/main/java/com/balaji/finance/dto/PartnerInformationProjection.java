package com.balaji.finance.dto;

import com.balaji.finance.entity.PersonalInfo;

public interface PartnerInformationProjection {

    PersonalInfo getPartner();

    java.math.BigDecimal getInvestments();
}