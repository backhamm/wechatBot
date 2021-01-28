<template>
  <div>
    <img v-for="(img, i) of breatheList" :key="i" class="breathe" :style="{top: `${img.top}px`, left: `${img.left}px`}" :width="img.width" :src="img.src" alt="">
  </div>
</template>

<script>
export default {
  name: "Breathing",
  props: {
    breatheList: {
      type: Array,
      default: () => [
        {top: 112, left: 66, width: 71, src: require('../assets/triangle.svg')},
        {top: 88, left: 195, width: 38, src: require('../assets/round.svg')},
        {top: 154, left: 619, width: 24, src: require('../assets/round.svg')},
        {top: 60, left: 748, width: 34, src: require('../assets/rectangle.svg')}
      ]
    }
  }
}
</script>

<style lang="less" scoped>
  @keyframes breathing {
    0% {
      transform: scale(.8);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(.8);
    }
  }
  .breathe {
    position: fixed;
    animation: breathing 7s infinite ease-in-out;
  }
</style>