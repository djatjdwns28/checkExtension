<template>
  <v-container>
    <v-row dense style="height:100%;">
        <v-col cols="12" style="display:flex">
              <v-checkbox v-for="(item,idx) in extensionFixList" :key="item.id"  :label="item.name" v-model="item.value" @change="chageCheck(item, idx)"></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field outlined v-model="newExtension"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn @click="addExtension">추가</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-card width="100%">
          <v-chip-group>
            <v-chip v-for="(chip ,idx) in chipGroup" :key="idx" class="ma-2" close @click:close="removeExtension(chip)">{{chip.name}}</v-chip>
          </v-chip-group>
        </v-card>
      </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',

    data: () => ({
      extensionList:[],
      extensionFixList:[],
      chipGroup:[],
      newExtension: null,
    }),
    methods:{
      async chageCheck(item,idx){

        const response = await this.$axios.put(`${item.id}`, {
          show : item.show === 0 ? 1 : 0,
        })

        if(response.status === 200){
          this.$set(this.extensionList[idx], 'show', item.show === 0 ? 1 : 0)
          this.$set(this.extensionList[idx], 'value', item.value === 0 ? false : true)
          if(this.extensionList[idx].show === 1){
            this.addChip(this.extensionList[idx])
          }
          if(this.extensionList[idx].show === 0){
            this.removeChip(this.extensionList[idx])
          }
        }
        
      },
      addChip(item){
        this.chipGroup.push(item)
      },
      removeChip(item){
        this.chipGroup = this.chipGroup.filter(chip =>{
          return chip.id !== item.id
        })
      },
      async addExtension(){
        const res = await this.$axios.post('/add', {
          name: this.newExtension,
          show: 1,
        })
        if(res.status === 200){
          this.addChip({
            id: res.data.insertId,
            name: this.newExtension,
            show: 1,
          })
          this.extensionList.push({
            id: res.data.insertId,
            name: this.newExtension,
            show: 1,
            fixed: 0,
          })
          this.newExtension = null
        }
      },
      async removeExtension(chip){
        console.log(chip)
        if(chip.fixed === 1){
          this.removeChip(chip)
        } else {
          const res = await this.$axios.delete(`/delete/${chip.id}`)        
          if(res.status === 200){
            this.removeChip(chip)
          }
        }
      },
    },
    async mounted(){
      this.extensionList = (await this.$axios.get('/')).data
      this.extensionList.forEach(extension => {
        extension.value = extension.show === 0 ? false : true
        if(extension.show === 1){
          this.chipGroup.push(extension)
        }
      })
      this.extensionFixList = this.extensionList.filter(extension2 => {
        return extension2.fixed === 1
      })
      console.log(this.extensionList)
      console.log(this.extensionFixList)
    }
  }
</script>
