package com.balaji.finance.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.repo.AccountMasterRepo;

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

	public String findTransacTypeByMasterCodeAndCode(String masterCode, String code) {
		return accountMasterRepo.findTransactionTypeByMasterCodeAndCode(masterCode, code);
	}

}
