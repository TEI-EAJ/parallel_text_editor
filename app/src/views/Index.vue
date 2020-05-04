<template>
  <v-app>
    <v-content>
      <v-toolbar :dark="true" flat>
        <v-toolbar-title>{{$t("title")}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="addFlag = true">
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
        <v-btn icon @click="export2">
          <v-icon>mdi-export</v-icon>
        </v-btn>
        <v-btn icon @click="importFlag = true">
          <v-icon>mdi-import</v-icon>
        </v-btn>
        <v-btn icon href="https://github.com/TEI-EAJ/parallel_text_editor" target="_blank">
          <v-icon>mdi-github-circle</v-icon>
        </v-btn>
        <v-btn text @click="changeLocale">
          {{$t("change_locale")}}
        </v-btn>
      </v-toolbar>

      <div :style="'height: '+height+'px; overflow-wrap: break-word; word-break: break-all;'">
        <splitpanes class="default-theme">
          <pane min-size="20">
            <v-card class="scroll vertical pa-5" id="main" style="background-color : #616161">
              <v-card class="pa-5">
                <Hello v-if="data_main" :elements="data_main.elements"></Hello>
              </v-card>
            </v-card>
          </pane>
          <pane>
            <v-card class="scroll vertical pa-5" id="sub" style="background-color : #616161">
              <v-card class="pa-5">
                <Hello v-if="data_sub" :elements="data_sub.elements"></Hello>
              </v-card>
            </v-card>
          </pane>
        </splitpanes>
      </div>
    </v-content>

    <v-dialog v-model="dialogFlag" max-width="60%">
      <v-card >
        <v-card-title class="headline grey lighten-2" primary-title>{{$t("edit_dialog")}}</v-card-title>
          <div class="pa-5">
            <template v-for="(element, index) in dialogData.elements">
              
              <template v-if="element.type=='text' && inputs.length > 0">

                <v-card :key="index" class="mb-10 pa-10">
                    <h3>{{element.text}}</h3>

                    <v-row class="mt-5">
                      <v-col cols="12" md="12">
                        <v-textarea
                          filled
                          v-model="inputs[index].text"
                          rows="1"
                          :label="$t('text_helper')"
                          :hint="'ex. '+element.text.substring(0, element.text.length / 2)"
                        ></v-textarea>
                      </v-col>
                      
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-text-field
                          :label="$t('id_helper')"
                          v-model="inputs[index].id"
                          filled
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-btn
                          block
                          color="primary"
                          @click="add(index)"
                          x-large
                        >
                          {{$t("add")}}
                        </v-btn>
                      </v-col>
                    </v-row>
                </v-card>
                <!-- <hr :key="'hr-'+index" class="my-5"/> -->
              </template>
            </template>

            <v-card class="mt-10 mb-5" v-if="advancedFlag">
              
              <v-container class="pa-10">
                <h3>{{$t("advanced_option")}}: {{$t("json_editor")}}</h3>
                <v-jsoneditor class="my-5" v-model="json" :options="options" :plus="true" height="600px" @error="onError"/>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary darken-1" @click="updateDialogData()">{{$t("update")}}</v-btn>
                  <v-btn color="darken-1" @click="dialogFlag = false">{{$t("close")}}</v-btn>
                </v-card-actions>
              </v-container>
            </v-card>
          </div>
        </v-card>
    </v-dialog>


    <v-dialog v-model="resultFlag" max-width="80%">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>{{$t("export")}}</v-card-title>
        <div class="pa-5">
          <v-row>
            <v-col cols="12" md="6">
              <v-textarea
                solo
                :value="result"
                height="600px" 
                class="mb-5" 
              ></v-textarea>
            </v-col>

            <v-col cols="12" md="6">
              <v-jsoneditor class="mb-5" v-model="data_main" :options="options" :plus="true" height="600px" @error="onError"/>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-dialog>

 
    <v-dialog v-model="importFlag" max-width="60%">
      <v-card class="pb-5">
        <v-card-title class="headline grey lighten-2" primary-title>{{$t("import")}}</v-card-title>
        <div class="pa-5">
          <v-jsoneditor class="my-5" v-model="importData" :options="options" :plus="true" height="600px" @error="onError"/>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" @click="importAction()">{{$t("import")}}</v-btn>
          <v-btn color="darken-1" @click="importFlag = false">{{$t("close")}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-dialog v-model="confirmFlag" persistent max-width="60%">
      <v-card class="pb-5">
        <v-card-title class="headline grey lighten-2" primary-title>{{$t("confirm_dialog")}}</v-card-title>
        <div class="pa-5">
          {{$t("confirm_text")}}
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" @click="importDataFromLs(); confirmFlag = false;">{{$t("yes")}}</v-btn>
          <v-btn color="error darken-1" @click="importDataFromUrl(); confirmFlag = false">{{$t("no")}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addFlag" max-width="80%">
      <v-card class="pb-5">
        <v-card-title class="headline grey lighten-2" primary-title>{{$t("add_dialog")}}</v-card-title>
        <div class="pa-5">
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                :label="$t('left_window')"
                v-model="url_main"
                filled
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                :label="$t('right_window')"
                v-model="url_sub"
                filled
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
        <v-card-actions>
          <v-btn :loading="loadingFlag" :disabled="loadingFlag" color="info darken-1" @click="setExamples(0)">{{$t("sample")}} 1</v-btn>
          <v-spacer></v-spacer>
          <v-btn :loading="loadingFlag" :disabled="loadingFlag" color="primary darken-1" @click="updateUrls()">{{$t("update")}}</v-btn>
          <v-btn :loading="loadingFlag" :disabled="loadingFlag" color="darken-1" @click="addFlag = false">{{$t("close")}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    
  </v-app>
</template>

<script>

// In your VueJS component.
import { Splitpanes, Pane } from "splitpanes";
import axios from "axios";
import VJsoneditor from 'v-jsoneditor/src/index'

import Hello from "../components/Hello.vue";

var convert = require("xml-js");

export default {
  components: { Splitpanes, Pane, Hello, VJsoneditor },
  data: function() {
    return {

      width: window.innerWidth,
      height: window.innerHeight,
      
      direction: "vertical",
      
      url_main: "",
      url_sub: "",


      data_main: null,
      data_sub: null,


      json: [],

      inputs: [],

      options : {mode: 'code'},

      result : {},
      resultFlag : false,
      importFlag : false,

      importData : "",

      confirmFlag : false,

      addFlag : false,

      loadingFlag: false,

      advancedFlag : false,

      samples : [
        {
          url_main : "https://genji.dl.itc.u-tokyo.ac.jp/data/tei/koui/01.xml",
          url_sub : "https://genji.dl.itc.u-tokyo.ac.jp/data/tei/yosano/01.xml"
        }
      ]
    };
  },
  computed: {
    mainLineId : {
      get() { return this.$store.getters.mainLineId},
      set(val) { this.$store.dispatch("setMainLineId", val)}
    },
    subLineId : {
      get() { return this.$store.getters.subLineId},
      set(val) { this.$store.dispatch("setSubLineId", val)}
    },
    dialogFlag : {
      get() { return this.$store.getters.dialogFlag},
      set(val) { this.$store.dispatch("setDialogFlag", val)}
    },
    dialogData : {
      get() { return this.$store.getters.dialogData},
      set(val) { this.$store.dispatch("setDialogData", val)}
    }
  },
  localStorage: {
    data_main: {
      type: Object
    },
    data_sub : {
      type: Object
    }
  },
  mounted: function() {

    this.advancedFlag = this.$route.query.advanced == "true" ? true : false

    window.addEventListener("resize", this.handleResize);

    let lsMainFlag = false

    //ローカルストレージがある場合
    if(this.$localStorage.get("data_main")){
      let data_main = this.$localStorage.get("data_main")
      if(data_main.elements){
        lsMainFlag = true
      }
    }

    if(lsMainFlag){
      this.confirmFlag = true
    } else {
      this.importDataFromUrl()
    }
  },
  watch: {
    /*
    $route() {
      //this.search();
    },
    */
    dialogData: {
      handler : function (val) {
        this.json = val.elements

        this.inputs = []

        if(this.json){
          for(let i = 0; i < this.json.length; i++){
            this.inputs.push({
              text : "",
              id : this.subLineId ? this.subLineId : ""
            })
          }
        }  
      },
      deep : true
    },
    mainLineId: function(){
      this.scroll("line-"+this.mainLineId, "sub")
    },
    subLineId: function(){
      this.scroll("anchor-"+this.subLineId, "main")
    }
  },
  methods: {
    setExamples(index){
      let sample = this.samples[index]
      this.url_main = sample.url_main
      this.url_sub = sample.url_sub
    },
    importDataFromLs(){
      this.data_main = this.$localStorage.get("data_main")
      this.url_main = this.$localStorage.get("url_main")

      this.data_sub = this.$localStorage.get("data_sub")
      this.url_sub = this.$localStorage.get("url_sub")
    },
    importDataFromUrl(){
      let url_main = this.$route.query.main
      this.url_main = url_main

      let url_sub = this.$route.query.sub
      this.url_sub = url_sub
      this.updateDataFromUrls()
    },
    updateUrls(){
      this.updateDataFromUrls()
    },
    updateDataFromUrls(){
      var result = window.confirm(this.$t("編集中のデータが削除されます。本当によろしいですね？")+"\n"+this.$t("必要に応じて現在の編集内容をエクスポートしてください。"));
    
      if( result ) {
          this.loadingFlag = true
          this.exec2main();
          this.exec2sub();
          this.loadingFlag = false
          this.addFlag = false
      }
    },
    scroll(target_id, window_id) {
      if(!document.querySelector("#" + target_id)){
        return
      }

      if (this.direction == "vertical") {
        this.$SmoothScroll(
          document.querySelector("#" + target_id).getBoundingClientRect()
            .left +
            document.querySelector("#" + window_id).scrollLeft -
            document.querySelector("#" + window_id).getBoundingClientRect().left -
            document.querySelector("#" + window_id).getBoundingClientRect()
              .width /
              2 +
            document.querySelector("#" + target_id).getBoundingClientRect()
              .width,
          0.1,
          null,
          document.querySelector("#" + window_id),
          "x"
        );
      } else {
        this.$SmoothScroll(
          document.querySelector("#" + target_id).getBoundingClientRect()
            .top +
            document.querySelector("#" + window_id).scrollTop -
            document.querySelector("#" + window_id).getBoundingClientRect().top,
          0.1,
          null,
          document.querySelector("#" + window_id),
          "y"
        );
      }
    },
    handleResize: function() {
      // resizeのたびにこいつが発火するので、ここでやりたいことをやる
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
    
    async exec2main() {
      if(!this.url_main){
        return
      }
      await axios
        .get(this.url_main)
        .then(response => {
          let xml_node = response.data;
          if (typeof xml_node == "string") {
            var dpObj = new DOMParser();
            xml_node = dpObj.parseFromString(xml_node, "text/xml");
          }
          let xml_str = new XMLSerializer().serializeToString(xml_node);
          var result = convert.xml2json(xml_str, { compact: false, spaces: 4 });
          this.data_main = JSON.parse(result);

          this.$localStorage.set("url_main", this.url_main)
          this.$localStorage.set("data_main", this.data_main)
        }).catch((err) => {
          alert(err)
        });
    },

    async exec2sub() {
      if(!this.url_sub){
        return
      }
      await axios
        .get(this.url_sub)
        .then(response => {
          let xml_node = response.data;
          if (typeof xml_node == "string") {
            var dpObj = new DOMParser();
            xml_node = dpObj.parseFromString(xml_node, "text/xml");
          }
          let xml_str = new XMLSerializer().serializeToString(xml_node);
          var result = convert.xml2json(xml_str, { compact: false, spaces: 4 });
          this.data_sub = JSON.parse(result);
          this.$localStorage.set("url_sub", this.url_sub)
          this.$localStorage.set("data_sub", this.data_sub)
        }).catch((err) => {
          alert(err)
        });
    },

    /*
    convert_uri: function(id) {
      let tmp = id.split("#");
      if (tmp.length != 2) {
        return "id-" + md5hex(id);
      }

      return "id-" + md5hex(tmp[0]) + "#" + tmp[1];
    },
    */

    updateDialogData: function(){
      let newData = Object.create(this.dialogData)
      newData.elements = this.json
      this.dialogData = newData

      this.dialogFlag = false

      this.inputs = []
    },

    add(index) {
      let input = this.inputs[index]
      let elements = this.dialogData.elements

      let text = this.dialogData.elements[index].text

      let input_text = input.text

      let divided_text = text.split(input_text)

      if(divided_text.length != 2){
        alert(this.$t("divide_err_message")+": "+divided_text.length)
        return
      }

      
      let texts = [divided_text[0], input_text + divided_text[1]]
  
      //削除
      elements.splice(index, 1)

      elements.splice(index, 0, {
          text : texts[0],
          type : "text"
      })

      elements.splice(index+1, 0, {
          name : "anchor",
          type : "element",
          attributes: {
            corresp : this.url_sub+"#"+input.id
          }
      })

      elements.splice(index+2, 0, {
          text : texts[1],
          type : "text"
      })

      
      this.dialogData.elements = elements

      this.afterMethod()

      this.dialogFlag = false
    },
    export2(){
      var options = {compact: false, ignoreComment: true, spaces: 4};
      let result = convert.json2xml(this.data_main, options)
      this.result = result
      this.resultFlag = true
    },
    importAction: function(){
      this.data_main = this.importData
      
      this.afterMethod()

      this.importFlag = false
    },
    afterMethod(){
      this.inputs = []
      this.$localStorage.set('data_main', this.data_main)
    },
    onError(){
      //console.log("error")
    },
    changeLocale() {
      this.$emit('change-locale');
    }
  },

  beforeDestroy: function() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>

<style>
.scroll {
  height: 100%;
  /*overflow-y: auto;*/
  overflow-y: auto;
}

.vertical {
  -webkit-writing-mode: vertical-rl;
  -ms-writing-mode: tb-rl;
  writing-mode: vertical-rl;
}

html,
body,
#app {
  height: 100%;
  margin: 0;
}
</style>
