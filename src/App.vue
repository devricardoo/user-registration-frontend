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
                  <tr>
                    <td>01/01/2023</td>
                    <td>Teste Usuário 1</td>
                    <td>12345678911</td>
                    <td>teste1@gmail.com</td>
                    <td>admin</td>
                    <td>
                      <v-btn color="primary" size="small">Detalhar</v-btn>
                      <v-btn color="primary" size="small" class="ml-2"
                        >Editar</v-btn
                      >
                      <v-btn color="error" size="small" class="ml-2"
                        >Excluir</v-btn
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>02/01/2023</td>
                    <td>Teste Usuário 2</td>
                    <td>12345678912</td>
                    <td>teste2@gmail.com</td>
                    <td>user</td>
                    <td>
                      <v-btn color="primary" size="small">Detalhar</v-btn>
                      <v-btn color="primary" size="small" class="ml-2"
                        >Editar</v-btn
                      >
                      <v-btn color="error" size="small" class="ml-2"
                        >Excluir</v-btn
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>03/01/2023</td>
                    <td>Teste Usuário 3</td>
                    <td>12345678913</td>
                    <td>teste3@gmail.com</td>
                    <td>admin</td>
                    <td>
                      <v-btn color="primary" size="small">Detalhar</v-btn>
                      <v-btn color="primary" size="small" class="ml-2"
                        >Editar</v-btn
                      >
                      <v-btn color="error" size="small" class="ml-2"
                        >Excluir</v-btn
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>04/01/2023</td>
                    <td>Teste Usuário 4</td>
                    <td>12345678914</td>
                    <td>teste4@gmail.com</td>
                    <td>user</td>
                    <td>
                      <v-btn color="primary" size="small">Detalhar</v-btn>
                      <v-btn color="primary" size="small" class="ml-2"
                        >Editar</v-btn
                      >
                      <v-btn color="error" size="small" class="ml-2"
                        >Excluir</v-btn
                      >
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Add User Modal -->
      <v-dialog v-model="dialogAddUser" max-width="500px">
        <v-card>
          <v-card-title class="ml-2 mt-2">
            <span class="headline">Adicionar Novo Usuário</span>
          </v-card-title>

          <v-card-text>
            <v-form>
              <v-text-field
                label="Nome"
                v-model="userName"
                type="text"
                required
              />

              <v-text-field
                label="E-mail"
                v-model="userEmail"
                type="email"
                required
              />

              <v-text-field
                label="Digite seu CPF"
                v-model="userCpf"
                @input="formatCPF"
                maxlength="14"
                required
              />

              <v-autocomplete
                v-model="userProfile"
                label="Selecione o Perfil"
                :items="['admin', 'user']"
                density="compact"
                required
              >
                <template v-slot:prepend-inner>
                  <div class="v-input__control" style="height: 56px"></div>
                </template>
              </v-autocomplete>

              <v-text-field
                label="Logradouro"
                v-model="userStreet"
                type="text"
              />

              <v-text-field
                label="CEP"
                v-model="userCep"
                maxlength="8"
                @input="formatCEP"
                type="text"
              />
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-btn text @click="dialogAddUser = false">Cancelar</v-btn>
            <v-btn color="primary" @click="addUser">Adicionar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const drawer = ref(null);
</script>

<script>
export default {
  data() {
    return {
      dialogAddUser: false,
      userCpf: "",
      userName: "",
      userEmail: "",
      userProfile: "",
      userStreet: "",
      userCep: "",
    };
  },
  methods: {
    formatCPF(event) {
      let cpf = this.userCpf.replace(/\D/g, ""); // Remove caracteres não numéricos

      // Verifica se o CPF possui 11 ou 14 dígitos
      if (cpf.length <= 11) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      }

      // Atualiza o v-model com o CPF formatado
      //this.userCpf = cpf;
    },
    formatCEP(event) {
      let cep = event.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos

      // Verifica o comprimento do CEP
      if (cep.length > 5) {
        // Adiciona o hífen no lugar correto
        cep = cep.slice(0, 5) + "-" + cep.slice(5, 8);
      }

      // Atualiza o v-model com o CEP formatado
      //this.userCep = cep;
    },
  },
};
</script>
