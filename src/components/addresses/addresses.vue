<template>
  <v-app id="inspire" theme="light">
    <v-navigation-drawer v-model="drawer" permanent color="#E8EAF6">
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-home"
          title="Início"
          value="inicio"
          to="/"
        />
        <v-list-item
          prepend-icon="mdi-map-marker"
          title="Endereços"
          value="enderecos"
        />

        <v-list-group value="Perfil">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-account"
              title="Perfil"
            />
          </template>

          <v-list-item
            prepend-icon="mdi-logout"
            title="Sair"
            value="logout"
            @click="handleLogout"
          />
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="#E8EAF6">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
      <v-toolbar-title v-if="loggedUser"
        >Olá, {{ loggedUser.name }}!</v-toolbar-title
      >
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col cols="12">
            <h2 class="mb-4" style="margin-left: 77px">Endereços</h2>
            <v-card flat class="border mb-4" style="width: 87%; margin: auto">
              <v-table>
                <thead>
                  <tr>
                    <th>Logradouro</th>
                    <th>CEP</th>
                    <th>Bairro</th>
                    <th>Cidade</th>
                    <th>Estado</th>
                    <th>Número</th>
                    <th>Complemento</th>
                    <th>Usuário</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(address, index) in paginationAddresses"
                    :key="index"
                  >
                    <td>{{ address.public_place || " - " }}</td>
                    <td>{{ address.cep || " - " }}</td>
                    <td>{{ address.neighborhood || " - " }}</td>
                    <td>{{ address.city || " - " }}</td>
                    <td>{{ address.state || " - " }}</td>
                    <td>{{ address.number || " - " }}</td>
                    <td>{{ address.complement || " - " }}</td>
                    <td>{{ address.users[0]?.name || " - " }}</td>
                    <td>
                      <v-btn
                        color="error"
                        size="small"
                        class="ml-2"
                        @click="openDeleteAddressDialog(address)"
                        >Excluir</v-btn
                      >
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
              />
            </div>
          </v-col>
        </v-row>
      </v-container>

      <deleteAddressDialog
        v-model="deleteAddressDialog"
        title="Excluir endereço"
        @confirm="confirmDeleteAddress"
      />
    </v-main>
  </v-app>
</template>

<script>
import api from "@/services/api";
import deleteAddressDialog from "@/components/addresses/deleteAdressesDialog.vue";

export default {
  components: { deleteAddressDialog },
  data: () => ({
    drawer: false,
    loggedUser: null,
    page: 1,
    selectedAddress: null,
    deleteAddressDialog: false,
    paginationData: {
      data: [],
      current_page: 1,
      last_page: 1,
      per_page: 5,
    },
  }),

  computed: {
    paginationAddresses() {
      return this.paginationData.data;
    },
    paginationLength() {
      return this.paginationData.last_page;
    },
  },

  methods: {
    fetchLoggedUser() {
      api.get("http://localhost:8000/api/me").then((response) => {
        this.loggedUser = response.data;
      });
    },

    fetchAddresses() {
      api
        .get(
          `http://localhost:8000/api/address?page=${this.page}&per_page=${this.paginationData.per_page}`,
        )
        .then((response) => {
          const res = response.data;
          this.paginationData.data = res.data;
          this.paginationData.current_page = res.current_page;
          this.paginationData.last_page = res.last_page;

          this.page = res.current_page;
        })
        .catch((error) => {
          console.error("Erro ao buscar endereços:", error);
        });
    },

    handleLogout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },

    openDeleteAddressDialog(address) {
      this.selectedAddress = address;
      this.deleteAddressDialog = true;
    },

    confirmDeleteAddress() {
      api
        .delete(`http://localhost:8000/api/address/${this.selectedAddress.id}`)
        .then(() => {
          this.fetchAddresses();
        })
        .catch((error) => {
          console.error("Erro ao excluir endereço:", error);
        });
    },
  },

  watch: {
    page() {
      this.fetchAddresses();
    },
  },

  mounted() {
    this.fetchLoggedUser();
    this.fetchAddresses();
  },
};
</script>
