package com.balaji.finance.masterInfo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "AccountMaster")
public class AccountMaster {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "Type", nullable = false)
	private String type;

	@Column(name = "MasterCode", nullable = false)
	private String masterCode;

	@Column(name = "Code", nullable = false)
	private String code;

	@Column(name = "Visibility")
	private Boolean visibility;

	@Column(name = "MasterIcon")
	private String masterIcon;

	@Column(name = "PersonType")
	private String personType;

	@Column(name = "TransType")
	private String transType;

	public AccountMaster() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getMasterCode() {
		return masterCode;
	}

	public void setMasterCode(String masterCode) {
		this.masterCode = masterCode;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Boolean getVisibility() {
		return visibility;
	}

	public void setVisibility(Boolean visibility) {
		this.visibility = visibility;
	}

	public String getMasterIcon() {
		return masterIcon;
	}

	public void setMasterIcon(String masterIcon) {
		this.masterIcon = masterIcon;
	}

	public String getPersonType() {
		return personType;
	}

	public void setPersonType(String personType) {
		this.personType = personType;
	}

	public String getTransType() {
		return transType;
	}

	public void setTransType(String transType) {
		this.transType = transType;
	}
	
	
}
