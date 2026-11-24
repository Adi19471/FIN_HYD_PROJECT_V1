package com.balaji.finance.pojo;

import java.util.List;

public class UserSaveReq {

	private Integer id;
	private String name;
	private String password;
	private String role;
	private List<Long> permissionIds;

	// The branches the user may work in (Branch.code).
	private List<String> branchCodes;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public List<Long> getPermissionIds() {
		return permissionIds;
	}

	public void setPermissionIds(List<Long> permissionIds) {
		this.permissionIds = permissionIds;
	}


	public List<String> getBranchCodes() {
		return branchCodes;
	}

	public void setBranchCodes(List<String> branchCodes) {
		this.branchCodes = branchCodes;
	}
}
