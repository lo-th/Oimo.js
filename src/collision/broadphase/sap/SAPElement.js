/**
 * An element of proxies.
 * @author saharan
 */

function SAPElement ( proxy, max ) {

    // The parent proxy
    this.proxy = proxy;
	// The pair element.
    this.pair = null;
    // The minimum element on other axis.
    this.min1 = null;
    // The maximum element on other axis.
    this.max1 = null;
    // The minimum element on other axis.
    this.min2 = null;
    // The maximum element on other axis.
    this.max2 = null;
    // Whether the element has maximum value or not.
    this.max = max;
    // The value of the element.
    this.value = 0;

};

export { SAPElement };