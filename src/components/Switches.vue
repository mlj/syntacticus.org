<template>
    <label :class="classObject">
        <span class="vue-switcher__label" v-if="shouldShowLabel">
            <span v-if="label" v-text="label"></span>
            <span v-if="!label && value" v-text="textEnabled"></span>
            <span v-if="!label && !value" v-text="textDisabled"></span>
        </span>

        <input type="checkbox" :disabled="disabled" @change="trigger" :checked="value">

        <div></div>
    </label>
</template>

<script>
/*eslint-disable*/
export default {
    name: 'switches',
    props: {
        typeBold: {
            default: false
        },
        value: {
            default: false
        },
        disabled: {
            default: false
        },
        label: {
            default: ''
        },
        textEnabled: {
            default: ''
        },
        textDisabled: {
            default: ''
        },
        color: {
            default: 'default'
        },
        emitOnMount: {
            default: true
        }
    },
    mounted () {
        if(this.emitOnMount) {
            this.$emit('input', this.value)
        }
    },
    methods: {
        trigger (e) {
            this.$emit('input', e.target.checked)
        }
    },
    computed: {
        classObject () {
            const { color, value, typeBold, disabled } = this;
            return {
                'vue-switcher' : true,
                ['vue-switcher--unchecked'] : !value,
                ['vue-switcher--disabled'] : disabled,
                ['vue-switcher--bold']: typeBold,
                ['vue-switcher--bold--unchecked']: typeBold && !value,
                [`vue-switcher-color--${color}`] : color,
            };
        },
        shouldShowLabel () {
            return this.label !== '' || this.textEnabled !== '' || this.textDisabled !== '';
        }
    }
}
</script>

<style lang="scss">
$theme-bulma-colors: (
  default : #A88ABF,
);
.vue-switcher {
    position: relative;
    display: inline-block;
    &__label {
        display: block;
        font-size: 10px;
        margin-bottom: 5px;
    }
    input {
        opacity: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        cursor: pointer;
    }
    div {
        height: 10px;
        width: 40px;
        position: relative;
        border-radius: 30px;
        display: -webkit-flex;
        display: -ms-flex;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;
        transition: all ease .4s;
        &:after {
            content: '';
            height: 18px;
            width: 18px;
            border-radius: 100px;
            display: block;
            transition: all ease .3s;
            position: absolute;
            left: 100%;
            margin-left: -17px;
            cursor: pointer;
            top: -4px;
        }
    }
    &--unchecked {
        div {
            justify-content: flex-end;
            &:after {
                left: 15px;
            }
        }
    }
    &--disabled {
        div {
            opacity: .3;
        }
        input {
            cursor: not-allowed;
        }
    }
    &--bold {
        div {
            top: -8px;
            height: 26px;
            width: 51px;
            &:after {
                margin-left: -22px;
                top: 4px;
            }
        }
        &--unchecked {
            div {
                &:after {
                    left: 26px;
                }
            }
        }
        .vue-switcher__label {
            span {
                padding-bottom: 7px;
                display: inline-block;
            }
        }
    }
    @each $colorName, $color in $theme-bulma-colors {
        &.vue-switcher-color--#{$colorName} {
            div {
                @if $colorName == 'default' {
                    background-color: darken($color, 10%);
                } @else {
                    background-color: lighten($color, 10%);
                }
                &:after {
                    background-color: $color;
                }
            }
            &.vue-switcher--unchecked {
                div {
                    @if $colorName == 'default' or $colorName == 'yellow' {
                        background-color: darken($color, 5%);
                    } @else {
                        background-color: lighten($color, 30%);
                    }
                    &:after {
                        @if $colorName == 'default' {
                            background-color: $color;
                        } @else {
                            background-color: lighten($color, 10%);
                        }
                    }
                }
            }
        }
    }
}
</style>
