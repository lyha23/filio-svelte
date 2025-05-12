<script lang="ts">
  import styles from './Button.module.scss';
  import { ButtonTypes } from './button.store';

  export let type: ButtonTypes;
  export let onClick: () => void = () => {};
  export let name: string;
  export let href: string;
  export let classes: string;
  export let otherProps: Record<string, string>;

  function getButtonTypeStyles(type: ButtonTypes) {
    return type === ButtonTypes.PRIMARY
      ? styles.primary
      : type === ButtonTypes.WHITE
      ? styles.white
      : styles.outline;
  }
</script>

<a
  {...otherProps}
  on:click="{onClick}"
  {href}
  class="{`${getButtonTypeStyles(type)} buttonClasses link ${classes}`}"
>
  {name}
</a>

<style scoped>
  .buttonClasses {
    @apply py-2 px-7 font-medium rounded text-base md:text-xl tracking-wide  duration-300 flex items-center;
  }
  .ml-3 {
    @apply ml-3;
  }
  .mr-3 {
    @apply ml-3;
  }
</style>
