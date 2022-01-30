/**
 * https://github.com/freeze-component/vue-popper
 * */
import { createPopper } from '@popperjs/core'

export default {
    props: {
        eventsEnabled: {
            type: Boolean,
            default: false
        },
        // placement: {
        //     type: String,
        //     default: 'bottom'
        // },
        boundariesPadding: {
            type: Number,
            default: 5
        },
        reference: Object,
        popper: Object,
        offset: {
            default: 0
        },
        value: {
            type: Boolean,
            default: false
        },
        transition: String,
        options: {
            type: Object,
            default () {
                return {
                    // modifiers: {
                    //     computeStyle:{
                    //         gpuAcceleration: false,
                    //     },
                    //     preventOverflow :{
                    //         boundariesElement: 'window'
                    //     }
                    // }
                    modifiers: []
                };
            }
        },
        // visible: {
        //     type: Boolean,
        //     default: false
        // }
    },
    data () {
        return {
            visible: this.value
        };
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                this.visible = val;
                this.$emit('input', val);
            }
        },
        visible(val) {
            if (val) {
                if (this.handleIndexIncrease) this.handleIndexIncrease();  // just use for Poptip
                this.updatePopper();
                this.$emit('on-popper-show');
            } else {
                this.$emit('on-popper-hide');
            }
            this.$emit('input', val);
        }
    },
    methods: {
        onCreatePopper() {
            if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.placement)) {
                return;
            }

            const options = this.options;
            const popper = this.popper || this.$refs.popper;
            const reference = this.reference || this.$refs.reference;

            if (!popper || !reference) return;

            // eslint-disable-next-line no-prototype-builtins
            if (this.popperJS && this.popperJS.hasOwnProperty('destroy')) {
                this.popperJS.destroy();
            }
            
            options.eventsEnabled = this.eventsEnabled;

            options.placement = this.placement;

            if (!options.modifiers.offset) {
                options.modifiers.offset = {};
            }
            options.modifiers.offset.offset = this.offset;
            options.onCreate =()=>{
                this.$nextTick(this.updatePopper);
                this.$emit('created', this);
            };

            this.popperJS = createPopper(reference, popper, options);

        },
        updatePopper() {
            this.popperJS ? this.popperJS.update() : this.onCreatePopper();
        },
        doDestroy() {
            if (this.visible) return;
            this.popperJS.destroy();
            this.popperJS = null;
        }
    },
    updated (){
        this.$nextTick(()=>this.updatePopper());

    },
    beforeDestroy() {
        if (this.popperJS) {
            this.popperJS.destroy();
        }
    }
};