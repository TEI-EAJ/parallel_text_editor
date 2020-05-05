<template>
  <v-app>
    <v-content>
      <v-toolbar :dark="true" flat>
        <v-toolbar-title>{{$t("title")}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="addFlag = true">
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
        <v-btn text @click="changeLocale">
          {{$t("change_locale")}}
        </v-btn>
      </v-toolbar>

      <div :style="'height: '+height+'px; overflow-wrap: break-word; word-break: break-all;'">
        <splitpanes class="default-theme">
          <pane min-size="20">
            <iframe
              class="py-2 px-2"
              :src="url_main"
              seamless="seamless"
              width="100%"
              :height="height+'px'"
              style="border: none;"
              allow="fullscreen"
            ></iframe>
          </pane>
          <pane>
            <v-card class="scroll pa-5" :class="direction == 'vertical' ? 'vertical' : ''" id="sub" style="background-color : #616161">
              <v-card class="pa-5">
                <Hello v-if="data_sub" :elements="data_sub.elements"></Hello>
              </v-card>
            </v-card>
          </pane>
        </splitpanes>
      </div>
    </v-content>
    
    <v-dialog v-model="confirmFlag" persistent max-width="60%">
      <v-card class="pb-5">
        <v-card-title class="headline grey lighten-2" primary-title>{{$t("confirm_dialog")}}</v-card-title>
        <div class="pa-5">
          {{$t("confirm_text")}}
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="importDataFromLs(); confirmFlag = false;">{{$t("yes")}}</v-btn>
          <v-btn color="darken-1" @click="importDataFromUrl(); confirmFlag = false">{{$t("no")}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addFlag" max-width="60%">
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
          <v-btn v-for="(obj, index) in samples" :key="index" :loading="loadingFlag" :disabled="loadingFlag" color="info" @click="setExamples(index)">{{$t(obj.description)}}</v-btn>
          <v-spacer></v-spacer>
          <v-btn :loading="loadingFlag" :disabled="loadingFlag" color="primary" @click="updateUrls()">{{$t("update")}}</v-btn>
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

import Hello from "../components/Hello.vue";

var convert = require("xml-js");

export default {
  components: { Splitpanes, Pane, Hello},
  data: function() {
    return {

      width: window.innerWidth,
      height: window.innerHeight,
      
      direction: "horizontal",
      
      url_main: "",
      url_sub: "",


      data_main: null,
      data_sub: null,


      json_editor_data: [],

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
      lsMainFlag : false,

      samples : [
        {
          url_main : "https://docs.google.com/document/d/1qOQmwivV1PaSI7wqx3zH_sRiUx4oHGuLO2gugoAvIfQ/edit",
          url_sub : "https://genji.dl.itc.u-tokyo.ac.jp/data/tei/yosano/01.xml",
          description : "サンプル"
        }
      ]
    };
  },
  computed: {
    subLineId : {
      get() { return this.$store.getters.subLineId},
      set(val) { this.$store.dispatch("setSubLineId", val)}
    }
  },
  mounted: function() {

    this.advancedFlag = this.$route.query.advanced == "true" ? true : false

    window.addEventListener("resize", this.handleResize);

    let lsMainFlag = false

    if(lsMainFlag){
      this.confirmFlag = true
    } else {
      this.importDataFromUrl()
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
      let result = true
    
      if( result ) {
          this.loadingFlag = true
          //this.exec2main();
          this.exec2sub();
          this.loadingFlag = false
          this.addFlag = false

          this.$router.push({ query: { main: this.url_main, sub: this.url_sub, advanced: this.advancedFlag }})
      }
    },
    handleResize: function() {
      // resizeのたびにこいつが発火するので、ここでやりたいことをやる
      this.width = window.innerWidth;
      this.height = window.innerHeight;
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
