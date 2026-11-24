package com.balaji.finance.pojo;

import com.balaji.finance.entity.Branch;

public class BranchDto {

	private String code;
	private String name;
	private String location;
	private boolean active;
	private Integer sortOrder;

	public BranchDto() {
	}

	public static BranchDto of(Branch branch) {
		BranchDto dto = new BranchDto();
		dto.setCode(branch.getCode());
		dto.setName(branch.getName());
		dto.setLocation(branch.getLocation());
		dto.setActive(branch.isActive());
		dto.setSortOrder(branch.getSortOrder());
		return dto;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public Integer getSortOrder() {
		return sortOrder;
	}

	public void setSortOrder(Integer sortOrder) {
		this.sortOrder = sortOrder;
	}
}
