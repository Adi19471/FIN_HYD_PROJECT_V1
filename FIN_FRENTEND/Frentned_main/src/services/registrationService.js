import registrationApi from "src/api/registrationApi";

const listFromResponse = (data, keys = []) => {
  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
};

const normalizePermissionIds = (permissionIds) => {
  if (!Array.isArray(permissionIds)) return [];

  return permissionIds
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id));
};

export const registrationService = {
  async loadUsers() {
    const res = await registrationApi.loadUsers();
    const users = listFromResponse(res.data, ["data", "users", "result"]);

    return users.map((user, index) => ({
      id: user.id ?? user._id ?? user.userId ?? `row-${index}`,
      name: user.name ?? user.username ?? user.email ?? "-",
      role: user.role || "-",
      permissionIds: normalizePermissionIds(user.permissionIds),
    }));
  },

  async loadPermissions() {
    const res = await registrationApi.loadPermissions();
    const permissions = listFromResponse(res.data, [
      "data",
      "permissions",
      "result",
    ]);

    return permissions.map((permission, index) => ({
      id: Number(permission.id ?? index + 1),
      menu: permission.menu || "-",
      subMenu: permission.subMenu || "-",
      screenName: permission.screenName || "-",
      rolePath: [permission.menu, permission.subMenu, permission.screenName]
        .filter(Boolean)
        .join(" --> "),
    }));
  },

  async saveUser(form) {
    const payload = {
      id: form.id ? Number(form.id) : 0,
      name: form.name.trim(),
      password: form.password?.trim() || null,
      role: form.role?.trim() || null,
      permissionIds: normalizePermissionIds(form.permissionIds),
    };

    if (form.id && !payload.password) {
      delete payload.password;
    }

    return registrationApi.saveUser(payload);
  },

  deleteUser(id) {
    return registrationApi.deleteUser(id);
  },
};

export default registrationService;
