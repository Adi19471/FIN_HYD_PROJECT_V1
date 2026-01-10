package com.balaji.finance.pojo;

public class AccountMasterSaveReqPojo {

	private Long id;
	private String type;
	private String masterCode;
	private String code;
	private Boolean visibility;
	private String masterIcon;
	private String personType;
	private String transType;

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
