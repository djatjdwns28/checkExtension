<template>
  <v-container>
      <v-row dense style="align-items:center;">
        <v-col cols="2">
          <label>고정 확장자</label>
        </v-col>
        <v-col cols="10" style="display:flex">
              <v-checkbox v-for="(item,idx) in extensionFixList" :key="item.id"  :label="item.name" v-model="item.show" @change="changeCheck(item, idx)"></v-checkbox>
        </v-col>
      </v-row>
      <v-row dense style="align-items:center;">
        <v-col cols="2">
          <label>커스텀 확장자</label>
        </v-col>
        <v-col cols="4">
          <v-form ref="form" onSubmit="return false;">
            <v-text-field :rules="rules.extensionRule" counter max-length="20" hide-details="auto" @keypress.enter="addExtension" outlined v-model="newExtension" placeholder="값을 입력하여 주십시오"></v-text-field>
          </v-form>
        </v-col>
        <v-col cols="2" style="align-items:center;">
          <v-btn :loading="addBtnLoading" @click="addExtension" class="primary" style="width:80%;">추가</v-btn>
        </v-col>
        <v-col cols="2" style="align-items:center;">
          <v-btn :loading="addBtnLoading2" @click="deleteAll" class="error" style="width:80%;">초기화</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-card width="100%" style="height:500px; overflow-y: scroll;" :title="countChip">
          <v-card-text>{{countChip}}</v-card-text>
            <v-chip v-for="(chip ,idx) in chipGroup" :key="idx" class="ma-2" close @click:close="removeExtension(chip)">{{chip.name}}</v-chip>
        </v-card>
      </v-row>
  </v-container>
</template>

<script>
  export default {

    data: () => ({
      extensionList:[],
      extensionFixList:[],
      chipGroup:[],
      newExtension: null,
      addBtnLoading: false,
      addBtnLoading2: false,
      rules:{
        extensionRule : [
          v => /^[a-zA-Z]*$/.test(v) || '확장자는 영문만 입력 가능합니다.',
          v => (v && v.length <= 20) || '최대 20자만 가능합니다.',
        ]
      }
    }),
    computed: {
      countChip() {
        const max = 200;
        let count;
        count = this.chipGroup.length;
        return `${count} / ${max}`
      }
    },
    methods:{
      async changeCheck(item,idx){

        const response = await this.$axios.put(`/extension/${item.id}`, {
          value : item.value === 0 ? 1 : 0,
        })

        if(response.status === 200){
          this.$set(this.extensionList[idx], 'value', item.value === 0 ? 1 : 0)
          this.$set(this.extensionList[idx], 'show', item.show === 0 ? false : true)
          if(this.extensionList[idx].value === 1){
            if(this.extensionList[idx].fixed === 0) {
              this.addChip(this.extensionList[idx])
            }
          }
          if(this.extensionList[idx].value === 0){
            this.removeChip(this.extensionList[idx])
          }
        }
        
      },
      addChip(item){
        if(this.chipGroup.length > 200) {
          alert('더 이상 추가할 수 없습니디ㅏ.')
          this.newExtension = null
        } else {
          this.chipGroup.push(item)
        }
      },
      removeChip(item){
        this.chipGroup = this.chipGroup.filter(chip =>{
          return chip.id !== item.id
        })
      },
      async addExtension(){
        this.addBtnLoading = true
        const validate = this.$refs.form.validate()
        if(validate){
          if(this.newExtension === null || this.newExtension === ''){
            alert('값을 입력하여 주십시오!')
          } else {
            if(this.chipGroup.length >= 200){
              alert('더 이상 추가할 수 없습니다!')
            }
            if(this.chipGroup.length < 200) {
              const checkDuplicate = this.chipGroup.some((chip) => {
                return chip.name === this.newExtension.trim()
              })
              if(checkDuplicate === true){
                alert('이미 존재하는 값 입니다.')
                this.newExtension = null
                this.addBtnLoading = false
              }
              if(checkDuplicate === false){
                const res = await this.$axios.post('/extension/add', {
                  name: this.newExtension.trim(),
                  value: 1,
                })
                console.log(res)
                if(res.status === 200){
                  if(res.data.duplicate === true){
                    alert(res.data.message);
                    this.addBtnLoading = false
                  } else {
                    this.addChip({
                      id: res.data.insertId,
                      name: this.newExtension,
                      value: 1,
                    })
                    this.extensionList.push({
                      id: res.data.insertId,
                      name: this.newExtension,
                      value: 1,
                      fixed: 0,
                    })
                  }
                this.newExtension = null
                }
              }
            }
          }
        }
        this.addBtnLoading = false
        
      },
      async removeExtension(chip){
          const res = await this.$axios.delete(`/extension/delete/${chip.id}`)        
          if(res.status === 200){
            this.removeChip(chip)
          }
      },
      async deleteAll(){
        this.addBtnLoading2 = true
        if(confirm('정말 전체 초기화를 진행하시겠습니까?')) {
          const res = await this.$axios.delete('/extension/delete/all')
          if(res.status === 200){
            alert('초기화 하였습니다!')
            this.chipGroup = []
            this.addBtnLoading2 = false
          }
        } else {
          this.addBtnLoading2 = false
        }
      },
      async setDefaultData(){
        this.extensionList = (await this.$axios.get('/extension')).data
        this.extensionList.forEach(extension => {
          extension.show = extension.value === 0 ? false : true
          if(extension.value === 1){
            if(extension.fixed === 0){
              this.chipGroup.push(extension)
            }
          }
        })
        this.extensionFixList = this.extensionList.filter(extension2 => {
          return extension2.fixed === 1
        })
      }
    },
    mounted(){
      this.setDefaultData()
    }
  }
</script>
