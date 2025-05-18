<template>
  <v-app id="inspire" theme="light">
    <v-navigation-drawer v-model="drawer" permanent color="#E8EAF6">
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-home"
          title="Início"
          value="inicio"
          :active="activeItem === !activeItem"
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
      <v-toolbar-title v-if="paginationData"
        >Olá, {{ paginationData.data[0]?.name }}</v-toolbar-title
      >
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12">
            <h2 class="mb-4" style="margin-left: 110px">Usuários</h2>
            <v-card flat class="border mb-4" style="width: 81%; margin: auto">
              <div class="d-flex justify-space-between">
                <v-card-title>
                  <v-btn
                    variant="tonal"
                    size="small"
                    color="blue-grey"
                    @click="dialogFilterUsers = true"
                    >Filtrar</v-btn
                  >
                </v-card-title>
                <v-card-title>
                  <v-btn
                    variant="tonal"
                    size="small"
                    @click="dialogAddUser = true"
                    color="primary"
                  >
                    Adicionar usuário
                  </v-btn>
                </v-card-title>
              </div>
              <v-table>
                <thead class="bg-grey-lighten-4">
                  <tr>
                    <th style="width: 13%">Data de Cadastro</th>
                    <th style="width: 13%">Nome</th>
                    <th style="width: 13%">CPF</th>
                    <th style="width: 13%">E-mail</th>
                    <th>Perfil</th>
                    <th class="ml-5">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in paginationData.data" :key="index">
                    <td>
                      {{ new Date(item.created_at).toLocaleDateString() }}
                    </td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.cpf }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.profile?.name ?? "-" }}</td>
                    <td>
                      <v-btn
                        color="primary"
                        size="small"
                        @click="dialogDetailUser = true"
                        >Detalhar</v-btn
                      >
                      <v-btn
                        color="primary"
                        size="small"
                        class="ml-2"
                        @click="openEditUserDialog(item)"
                      >
                        Editar
                      </v-btn>
                      <v-btn
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
                next-icon="mdi-menu-right"
                prev-icon="mdi-menu-left"
              ></v-pagination>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <AddUserDialog v-model="dialogAddUser" :profiles="userProfiles" />
      <EditUserDialog
        v-model="dialogEditUser"
        :profiles="userProfiles"
        :user-to-edit="selectedUser"
        @update-user="handleUpdateUser"
      />
      <DeleteUserDialog v-model="dialogDeleteUser" :user="selectedUser" />
      <DetailUserModal v-model="dialogDetailUser" />
      <FilterUsers v-model="dialogFilterUsers" />
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import AddUserDialog from "@/components/AddUserDialog.vue";
import EditUserDialog from "@/components/EditUserDialog.vue";
import DeleteUserDialog from "@/components/DeleteUserDialog.vue";
import FilterUsers from "@/components/FilterUsers.vue";
import DetailUserModal from "@/components/DetailUserModal.vue";

export default {
  components: {
    AddUserDialog,
    EditUserDialog,
    DeleteUserDialog,
    FilterUsers,
    DetailUserModal,
  },
  data() {
    return {
      drawer: false,
      dialogAddUser: false,
      dialogEditUser: false,
      dialogDeleteUser: false,
      dialogDetailUser: false,
      dialogFilterUsers: false,
      page: 1,
      formValid: false,
      selectedUser: null,
      paginationData: {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 5,
      },
      userProfiles: [
        { text: "ADM", value: "admin" },
        { text: "USER", value: "user" },
      ],
      activeItem: false,
    };
  },
  computed: {
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
  },
  methods: {
    filter() {
      console.log("O que deseja filtrar?");
    },
    fetchUsers() {
      axios
        .get(
          `http://localhost:8000/api/user?page=${this.page}&per_page=${this.paginationData.per_page}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )
        .then((response) => {
          this.paginationData = response.data;
          console.log(this.paginationData);
        })
        .catch((error) => {
          if (err.response && err.response.status === 401) {
            // Token inválido ou expirado
            this.$router.push("/login");
          }
        });
    },
    openEditUserDialog(user) {
      this.selectedUser = { ...user };
      this.dialogEditUser = true;
    },
    openDeleteUserDialog(user) {
      this.selectedUser = { ...user };
      this.dialogDeleteUser = true;
    },
    handleUpdateUser(updatedUser) {
      const index = this.paginationData.data.findIndex(
        (user) => user.id === updatedUser.id,
      );
      if (index !== -1) {
        this.paginationData.data.splice(index, 1, updatedUser);
      }
    },
    handleLogout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>
