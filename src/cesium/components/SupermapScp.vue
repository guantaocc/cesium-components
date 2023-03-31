<script>
import { findRealParent } from "../utils";
export default {
  name: "SupermapScp",
  props: {
    url: String,
  },
  mounted() {
    this.parentContainer = findRealParent(this.$parent);
    this.viewer = this.parentContainer.viewer;
  },
  data() {
    return {
      collection: [],
    };
  },
  methods: {
    addImagery(provider) {
      this.viewer.addImageryProvider(provider);
    },
  },
  render() {
    return null;
  },
};
</script>

<style lang="scss" scoped></style>
