<template>
  <v-app id="inspire" theme="light">
    <v-navigation-drawer v-model="drawer" permanent>
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-home"
          title="Início"
          value="inicio"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>Olá, Fulano</v-toolbar-title>

      <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12">
            <h2 class="mb-4" style="margin-left: 110px">Usuários</h2>
            <v-card flat class="border mb-4" style="width: 81%; margin: auto">
              <div class="d-flex justify-end">
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
                  <tr v-for="(item, index) in paginatedUsers" :key="index">
                    <td>
                      {{ new Date(item.created_at).toLocaleDateString() }}
                    </td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.cpf }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.profile?.name ?? "-" }}</td>
                    <td>
                      <v-btn color="primary" size="small">Detalhar</v-btn>
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
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
import AddUserDialog from "./components/AddUserDialog.vue";
import EditUserDialog from "./components/EditUserDialog.vue";
import DeleteUserDialog from "./components/DeleteUserDialog.vue";

export default {
  components: {
    AddUserDialog,
    EditUserDialog,
    DeleteUserDialog,
  },
  data() {
    return {
      drawer: false,
      dialogAddUser: false,
      dialogEditUser: false,
      dialogDeleteUser: false,
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
    fetchUsers() {
      axios
        .get(
          `http://localhost:8000/api/user?page=${this.page}&per_page=${this.paginationData.per_page}`,
        )
        .then((response) => {
          this.paginationData = response.data;
          console.log(this.paginationData);
        })
        .catch(console.error);
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
  },
};
</script>
