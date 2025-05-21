<template>
  <v-app id="inspire" theme="light">
    <v-navigation-drawer v-model="drawer" permanent color="#E8EAF6">
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-home"
          title="Início"
          value="inicio"
        ></v-list-item>

        <v-list-item
          v-if="isAdmin()"
          prepend-icon="mdi-map-marker"
          to="/addresses"
          title="Endereços"
          value="enderecos"
        ></v-list-item>

        <v-list-group value="Perfil">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-account"
              title="Perfil"
            ></v-list-item>
          </template>

          <v-list-item
            prepend-icon="mdi-logout"
            title="Sair"
            value="logout"
            @click="handleLogout"
          ></v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="#E8EAF6">
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title v-if="loggedUser"
        >Olá, {{ loggedUser.name }}!</v-toolbar-title
      >
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12">
            <h2 class="mb-4" style="margin-left: 73px">Usuários</h2>
            <v-card flat class="border mb-4" style="width: 87%; margin: auto">
              <div class="d-flex justify-space-between">
                <v-card-title>
                  <v-btn
                    variant="tonal"
                    size="small"
                    color="blue-grey"
                    @click="dialogFilterUsers = true"
                    >Filtrar</v-btn
                  >

                  <v-btn
                    v-if="isFiltered"
                    variant="text"
                    icon="mdi-close-circle"
                    @click="clearFilters"
                    class="ml-2"
                    color="red"
                  ></v-btn>
                </v-card-title>
                <v-card-title>
                  <v-btn
                    v-if="isAdmin()"
                    variant="tonal"
                    size="small"
                    @click="dialogAddUser = true"
                    color="primary"
                  >
                    Adicionar usuário
                  </v-btn>
                </v-card-title>
              </div>
              <v-table v-if="loggedUser">
                <thead class="bg-grey-lighten-4">
                  <tr>
                    <th style="width: 11%">Data de Cadastro</th>
                    <th style="width: 9%">Nome</th>
                    <th style="width: 16%">CPF</th>
                    <th style="width: 1%">E-mail</th>
                    <th style="width: 5%">Perfil</th>
                    <th class="ml-5">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in filteredUsers" :key="index">
                    <td>
                      {{ new Date(item.created_at).toLocaleDateString() }}
                    </td>
                    <td>{{ item.name }}</td>
                    <td>{{ formatCPF(item.cpf) }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.profile?.name ?? "-" }}</td>
                    <td>
                      <v-btn
                        color="primary"
                        size="small"
                        @click="openDetailUserDialog(item)"
                        >Detalhar</v-btn
                      >
                      <v-btn
                        v-if="isAdmin()"
                        color="primary"
                        size="small"
                        class="ml-2"
                        @click="openEditUserDialog(item)"
                      >
                        Editar
                      </v-btn>
                      <v-btn
                        v-if="isAdmin()"
                        color="error"
                        size="small"
                        class="ml-2"
                        @click="openDeleteUserDialog(item)"
                      >
                        Excluir
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>

            <div class="text-center">
              <v-pagination
                v-model="page"
                :length="paginationLength"
                :total-visible="5"
                next-icon="mdi-menu-right"
                prev-icon="mdi-menu-left"
              ></v-pagination>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <AddUserDialog
        v-model="dialogAddUser"
        :profiles="userProfiles"
        @user-added="fetchUsers"
      />
      <EditUserDialog
        v-model="dialogEditUser"
        :profiles="userProfiles"
        :user-to-edit="selectedUser"
        @update-user="handleUpdateUser"
      />

      <DeleteUserDialog
        v-model="dialogDeleteUser"
        :user="selectedUser"
        @confirm-delete="handleDeleteUser"
      />
      <DetailUserModal v-model="dialogDetailUser" :user="selectedUser" />
      <FilterUsers v-model="dialogFilterUsers" @search="handleFilteredUsers" />
    </v-main>
  </v-app>
</template>

<script>
import api from "@/services/api";
import AddUserDialog from "@/components/AddUserDialog.vue";
import EditUserDialog from "@/components/EditUserDialog.vue";
import DeleteUserDialog from "@/components/DeleteUserDialog.vue";
import FilterUsers from "@/components/FilterUsers.vue";
import DetailUserModal from "@/components/DetailUserModal.vue";

export default {
  components: {
    AddUserDialog,
    DeleteUserDialog,
    DetailUserModal,
    EditUserDialog,
    FilterUsers,
  },
  data() {
    return {
      activeItem: false,
      dialogAddUser: false,
      dialogEditUser: false,
      dialogDeleteUser: false,
      dialogDetailUser: false,
      dialogFilterUsers: false,
      drawer: false,
      formValid: false,
      isFiltered: false,
      loggedUser: null,
      page: 1,
      paginationData: {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 5,
      },
      selectedUser: null,
      userProfiles: [
        { text: "ADM", value: 2 },
        { text: "USER", value: 3 },
      ],
    };
  },
  methods: {
    fetchLoggedUser() {
      api.get("http://localhost:8000/api/me").then((response) => {
        this.loggedUser = response.data;
      });
    },
    handleLogout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },

    fetchUsers() {
      api
        .get(
          `http://localhost:8000/api/user?page=${this.page}&per_page=${this.paginationData.per_page}`,
        )
        .then((response) => {
          this.paginationData = response.data;
        })
        .catch((error) => {
          console.error("Erro ao buscar usuários:", error);
        });
    },

    handleFilteredUsers(filteredUsers) {
      this.paginationData = {
        ...this.paginationData,
        data: filteredUsers,
        current_page: 1,
        last_page: Math.ceil(
          filteredUsers.length / this.paginationData.per_page,
        ),
      };
      this.isFiltered = true;
    },
    clearFilters() {
      this.isFiltered = false;
      this.fetchUsers();
    },

    handleDeleteUser() {
      this.fetchUsers();
    },
    handleUpdateUser(updatedUser) {
      const index = this.paginationData.data.findIndex(
        (user) => user.id === updatedUser.id,
      );
      if (index !== -1) {
        this.paginationData.data.splice(index, 1, updatedUser);
      }
    },

    openEditUserDialog(user) {
      this.selectedUser = { ...user };
      this.dialogEditUser = true;
    },
    openDeleteUserDialog(user) {
      this.selectedUser = { ...user };
      this.dialogDeleteUser = true;
    },
    openDetailUserDialog(item) {
      this.selectedUser = { ...item };
      this.dialogDetailUser = true;
    },

    formatCPF(cpf) {
      if (!cpf) return "";
      const cleaned = cpf.replace(/\D/g, "");
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    },
    isAdmin() {
      return (
        this.loggedUser &&
        this.loggedUser.profile &&
        this.loggedUser.profile.name === "ADM"
      );
    },
    isUser() {
      return (
        this.loggedUser &&
        this.loggedUser.profile &&
        this.loggedUser.profile.name === "USER"
      );
    },
  },
  computed: {
    filteredUsers() {
      if (!this.loggedUser) return this.paginationData.data;
      return this.paginationData.data.filter(
        (user) => user.id !== this.loggedUser.id,
      );
    },
    paginatedUsers() {
      return this.paginationData.data;
    },
    paginationLength() {
      return this.paginationData.last_page;
    },
  },
  watch: {
    page() {
      this.fetchUsers();
    },
  },
  mounted() {
    this.fetchUsers();
    this.fetchLoggedUser();
  },
};
</script>
