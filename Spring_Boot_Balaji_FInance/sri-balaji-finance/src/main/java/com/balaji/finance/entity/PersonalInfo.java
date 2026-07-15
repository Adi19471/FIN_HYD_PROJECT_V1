package com.balaji.finance.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "PERSONAL_INFO")
@EntityListeners(AuditingEntityListener.class)
public class PersonalInfo {

	@Id
	@Column(name = "PERSONAL_INFO_ID")
	private String personalInfoId;

	@Column(name = "FIRST_NAME")
	private String firstName;

	@Column(name = "LAST_NAME")
	private String lastName;

	@Column(name = "GENDER")
	private String gender;

	@Column(name = "FATHER_NAME")
	private String fatherName;

	@Column(name = "ADDRESS")
	private String address;

	@Column(name = "MOBILE")
	private String mobile;

	@Column(name = "PHONE")
	private String phone;

	@Column(name = "CATEGORY")
	private String category;

	@Column(name = "REFERENCE")
	private String reference;

	@Column(name = "ID_PROOF_TYPE")
	private String idProoftype;

	@Column(name = "ID_PROOF")
	private String idProof;

	@Column(name = "DISABLE")
	private boolean disable;

	@Column(name = "SHARES")
	private BigDecimal shares;

	@Column(name = "LOAN_LIMIT")
	private BigDecimal loanlimit;

	@Column(name = "ADDRESS2")
	private String address2;

	@Column(name = "MOBILE2")
	private String mobile2;

	@Column(name = "PHONE2")
	private String phone2;

	@Column(name = "OLD_ID")
	private String oldId;

	@Column(name = "age")
	private String age;

	@Column(name = "OCCUPATION")
	private String occupation;

	@Column(name = "SPOUSE")
	private String spouse;

	@Column(name = "BUSSINESS_EXEMPTION")
	private boolean bussinessExemption;

	@Column(name = "INTRO_NAME")
	private String introname;

	@Column(name = "SEQUENCE")
	private Long sequence;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PERSONAL_INFO_MANAGER_ID")
	private PersonalInfo personalInfoManager;

	@Column(name = "GROUP_MANAGER")
	private boolean groupManager;

	@CreatedDate
	@Column(updatable = false)
	private LocalDateTime createdDate;

	@LastModifiedDate
	private LocalDateTime modifiedDate;

	@CreatedBy
	@Column(updatable = false)
	private String createdBy;

	@LastModifiedBy
	private String modifiedBy;

	@Column(name = "PROFILE_PIC_NAME")
	private String profilePicName;

	@Column(name = "PROFILE_PIC_CONTENT_TYPE")
	private String profilePicContentType;

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "PROFILE_PIC")
	private byte[] profilePic;

	public String getPersonalInfoId() {
		return personalInfoId;
	}

	public void setPersonalInfoId(String personalInfoId) {
		this.personalInfoId = personalInfoId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getFatherName() {
		return fatherName;
	}

	public void setFatherName(String fatherName) {
		this.fatherName = fatherName;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getReference() {
		return reference;
	}

	public void setReference(String reference) {
		this.reference = reference;
	}

	public String getIdProoftype() {
		return idProoftype;
	}

	public void setIdProoftype(String idProoftype) {
		this.idProoftype = idProoftype;
	}

	public String getIdProof() {
		return idProof;
	}

	public void setIdProof(String idProof) {
		this.idProof = idProof;
	}

	public boolean isDisable() {
		return disable;
	}

	public void setDisable(boolean disable) {
		this.disable = disable;
	}

	public BigDecimal getShares() {
		return shares;
	}

	public void setShares(BigDecimal shares) {
		this.shares = shares;
	}

	public BigDecimal getLoanlimit() {
		return loanlimit;
	}

	public void setLoanlimit(BigDecimal loanlimit) {
		this.loanlimit = loanlimit;
	}

	public String getAddress2() {
		return address2;
	}

	public void setAddress2(String address2) {
		this.address2 = address2;
	}

	public String getMobile2() {
		return mobile2;
	}

	public void setMobile2(String mobile2) {
		this.mobile2 = mobile2;
	}

	public String getPhone2() {
		return phone2;
	}

	public void setPhone2(String phone2) {
		this.phone2 = phone2;
	}

	public String getOldId() {
		return oldId;
	}

	public void setOldId(String oldId) {
		this.oldId = oldId;
	}

	public String getAge() {
		return age;
	}

	public void setAge(String age) {
		this.age = age;
	}

	public String getOccupation() {
		return occupation;
	}

	public PersonalInfo getPersonalInfoManager() {
		return personalInfoManager;
	}

	public void setPersonalInfoManager(PersonalInfo personalInfoManager) {
		this.personalInfoManager = personalInfoManager;
	}

	public void setOccupation(String occupation) {
		this.occupation = occupation;
	}

	public String getSpouse() {
		return spouse;
	}

	public void setSpouse(String spouse) {
		this.spouse = spouse;
	}

	public boolean isBussinessExemption() {
		return bussinessExemption;
	}

	public void setBussinessExemption(boolean bussinessExemption) {
		this.bussinessExemption = bussinessExemption;
	}

	public String getIntroname() {
		return introname;
	}

	public void setIntroname(String introname) {
		this.introname = introname;
	}

	public LocalDateTime getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(LocalDateTime createdDate) {
		this.createdDate = createdDate;
	}

	public LocalDateTime getModifiedDate() {
		return modifiedDate;
	}

	public void setModifiedDate(LocalDateTime modifiedDate) {
		this.modifiedDate = modifiedDate;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getModifiedBy() {
		return modifiedBy;
	}

	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}

	public Long getSequence() {
		return sequence;
	}

	public void setSequence(Long sequence) {
		this.sequence = sequence;
	}

	public boolean isGroupManager() {
		return groupManager;
	}

	public void setGroupManager(boolean groupManager) {
		this.groupManager = groupManager;
	}

	public String getProfilePicName() {
		return profilePicName;
	}

	public void setProfilePicName(String profilePicName) {
		this.profilePicName = profilePicName;
	}

	public String getProfilePicContentType() {
		return profilePicContentType;
	}

	public void setProfilePicContentType(String profilePicContentType) {
		this.profilePicContentType = profilePicContentType;
	}

	public byte[] getProfilePic() {
		return profilePic;
	}

	public void setProfilePic(byte[] profilePic) {
		this.profilePic = profilePic;
	}

}
