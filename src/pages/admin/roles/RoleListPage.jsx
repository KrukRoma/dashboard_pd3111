import React, { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const RoleListPage = () => {
  // Ініціалізація ролей з Local Storage або дефолтне значення
  const loadRolesFromLocalStorage = () => {
    const savedRoles = localStorage.getItem("roles");
    return savedRoles ? JSON.parse(savedRoles) : [
      { id: 1, name: "user" },
      { id: 2, name: "admin" },
    ];
  };

  const [roles, setRoles] = useState(loadRolesFromLocalStorage());
  const [newRoleName, setNewRoleName] = useState("");
  const [editRoleId, setEditRoleId] = useState(null);
  const [editRoleName, setEditRoleName] = useState("");

  // Оновлення ролей у LocalStorage
  const saveRolesToLocalStorage = (updatedRoles) => {
    localStorage.setItem("roles", JSON.stringify(updatedRoles));
  };

  // Додавання нової ролі
  const addRole = () => {
    if (newRoleName.trim()) {
      const newRole = { id: roles.length + 1, name: newRoleName };
      const updatedRoles = [...roles, newRole];
      setRoles(updatedRoles);
      saveRolesToLocalStorage(updatedRoles);
      setNewRoleName("");
    }
  };

  // Редагування ролі
  const editRole = (id) => {
    const roleToEdit = roles.find((role) => role.id === id);
    if (roleToEdit) {
      setEditRoleId(id);
      setEditRoleName(roleToEdit.name);
    }
  };

  const saveEditRole = () => {
    if (editRoleName.trim()) {
      const updatedRoles = roles.map((role) =>
        role.id === editRoleId ? { ...role, name: editRoleName } : role
      );
      setRoles(updatedRoles);
      saveRolesToLocalStorage(updatedRoles);
      setEditRoleId(null);
      setEditRoleName("");
    }
  };

  // Видалення ролі
  const deleteRole = (id) => {
    const updatedRoles = roles.filter((role) => role.id !== id);
    setRoles(updatedRoles);
    saveRolesToLocalStorage(updatedRoles);
  };

  return (
    <div>
      <h1>Manage Roles</h1>

      {/* Форма для додавання нової ролі */}
      <TextField
        label="New Role"
        value={newRoleName}
        onChange={(e) => setNewRoleName(e.target.value)}
      />
      <Button onClick={addRole} variant="contained" color="primary">Add Role</Button>

      {/* Таблиця з ролями */}
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Role ID</TableCell>
              <TableCell>Role Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.id}</TableCell>
                <TableCell>
                  {editRoleId === role.id ? (
                    <TextField
                      value={editRoleName}
                      onChange={(e) => setEditRoleName(e.target.value)}
                    />
                  ) : (
                    role.name
                  )}
                </TableCell>
                <TableCell>
                  {editRoleId === role.id ? (
                    <Button onClick={saveEditRole} variant="outlined">Save</Button>
                  ) : (
                    <>
                      <IconButton onClick={() => editRole(role.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => deleteRole(role.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RoleListPage;
