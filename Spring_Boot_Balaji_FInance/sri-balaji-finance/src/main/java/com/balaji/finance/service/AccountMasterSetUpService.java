package com.balaji.finance.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.balaji.finance.entity.AccountMaster;
import com.balaji.finance.pojo.AccountMasterSaveReqPojo;
import com.balaji.finance.repo.AccountMasterRepo;

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

	public List<AccountMasterSaveReqPojo> findAll() {

		List<AccountMaster> totalList = accountMasterRepo.findAll();

		List<AccountMasterSaveReqPojo> toBeReturnedList = new ArrayList<AccountMasterSaveReqPojo>();

		for (AccountMaster accountMaster : totalList) {

			AccountMasterSaveReqPojo accountMasterSaveReqPojo = new AccountMasterSaveReqPojo();
			accountMasterSaveReqPojo.setId(accountMaster.getId());
			accountMasterSaveReqPojo.setCode(accountMaster.getCode());
			accountMasterSaveReqPojo.setMasterCode(accountMaster.getMasterCode());
			accountMasterSaveReqPojo.setMasterIcon(accountMaster.getMasterIcon());
			accountMasterSaveReqPojo.setPersonType(accountMaster.getPersonType());
			accountMasterSaveReqPojo.setTransType(accountMaster.getTransType());
			accountMasterSaveReqPojo.setType(accountMaster.getType());
			accountMasterSaveReqPojo.setVisibility(accountMaster.getVisibility());

			toBeReturnedList.add(accountMasterSaveReqPojo);
		}

		return toBeReturnedList;
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

	public List<String> findAllMasterCodes() {

		List<AccountMaster> totalList = accountMasterRepo.findAll();

		return totalList.stream().map(p -> p.getCode()).collect(Collectors.toList());
	}

}
