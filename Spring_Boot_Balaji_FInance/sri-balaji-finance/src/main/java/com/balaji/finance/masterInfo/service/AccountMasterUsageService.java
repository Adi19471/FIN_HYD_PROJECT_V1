package com.balaji.finance.masterInfo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.masterInfo.entity.AccountMaster;
import com.balaji.finance.masterInfo.repo.AccountMasterRepo;
import com.balaji.finance.pojo.AccountMasterSaveReqPojo;

@Service
public class AccountMasterUsageService {

	@Autowired
	private AccountMasterRepo accountMasterRepo;

	public List<String> findAllMasterCodes() {
		return accountMasterRepo.findAllMasterCodes(true);
	}

	public List<String> findAllCodesByMasterCode(String masterCode) {
		return accountMasterRepo.findAllCodesByMasterCode(masterCode);
	}

}
