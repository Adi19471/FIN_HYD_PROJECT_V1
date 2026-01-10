package com.balaji.finance.masterInfo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.masterInfo.entity.AccountMaster;
import com.balaji.finance.masterInfo.repo.AccountMasterRepo;
import com.balaji.finance.pojo.AccountMasterSaveReqPojo;

@Service
public class AccountMasterSetUpService {

	@Autowired
	private AccountMasterRepo accountMasterRepo;

	public AccountMasterSaveReqPojo findById(Long id) {

		Optional<AccountMaster> byId = accountMasterRepo.findById(id);

		if (byId.isPresent()) {

			AccountMaster accountMaster = byId.get();

			AccountMasterSaveReqPojo accountMasterSaveReqPojo = new AccountMasterSaveReqPojo();
			accountMasterSaveReqPojo.setId(accountMaster.getId());
			accountMasterSaveReqPojo.setCode(accountMaster.getCode());
			accountMasterSaveReqPojo.setMasterCode(accountMaster.getMasterCode());
			accountMasterSaveReqPojo.setMasterIcon(accountMaster.getMasterIcon());
			accountMasterSaveReqPojo.setPersonType(accountMaster.getPersonType());
			accountMasterSaveReqPojo.setTransType(accountMaster.getTransType());
			accountMasterSaveReqPojo.setType(accountMaster.getType());
			accountMasterSaveReqPojo.setVisibility(accountMaster.getVisibility());

			return accountMasterSaveReqPojo;

		}

		return null;
	}

	public void saveAccountMaster(AccountMasterSaveReqPojo accountMasterSaveReqPojo) {

		AccountMaster accountMaster = new AccountMaster();
		accountMaster.setCode(accountMasterSaveReqPojo.getCode());
		accountMaster.setMasterCode(accountMasterSaveReqPojo.getMasterCode());
		accountMaster.setMasterIcon(accountMasterSaveReqPojo.getMasterIcon());
		accountMaster.setPersonType(accountMasterSaveReqPojo.getPersonType());
		accountMaster.setTransType(accountMasterSaveReqPojo.getTransType());
		accountMaster.setType(accountMasterSaveReqPojo.getType());
		accountMaster.setVisibility(accountMasterSaveReqPojo.getVisibility());

		accountMasterRepo.save(accountMaster);
	}

	public void updateAccountMaster(AccountMasterSaveReqPojo accountMasterSaveReqPojo) {

		Optional<AccountMaster> byId = accountMasterRepo.findById(accountMasterSaveReqPojo.getId());

		if (byId.isPresent()) {
			AccountMaster accountMaster = byId.get();
			accountMaster.setCode(accountMasterSaveReqPojo.getCode());
			accountMaster.setMasterCode(accountMasterSaveReqPojo.getMasterCode());
			accountMaster.setMasterIcon(accountMasterSaveReqPojo.getMasterIcon());
			accountMaster.setPersonType(accountMasterSaveReqPojo.getPersonType());
			accountMaster.setTransType(accountMasterSaveReqPojo.getTransType());
			accountMaster.setType(accountMasterSaveReqPojo.getType());
			accountMaster.setVisibility(accountMasterSaveReqPojo.getVisibility());

			accountMasterRepo.save(accountMaster);
		}

	}

	public void deleteById(Long id) {

		Optional<AccountMaster> byId = accountMasterRepo.findById(id);

		if (byId.isPresent()) {

			accountMasterRepo.deleteById(id);

		}

	}

}
