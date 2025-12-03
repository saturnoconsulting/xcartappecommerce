  export const getTextStatus = (status) => {
    switch (status) {
      case 'active': return 'Attivo';
      case 'pending': return 'In attesa di pagamento';
      case 'expired': return 'Scaduto';
      case 'canceled': return 'Cancellato';
      case 'paid': return 'Pagato';
      case 'refunded': return 'Rimborsato';
      case 'suspended': return 'In sospeso';
      case 'shipped': return 'Spedito';
      case 'completed': return 'Completato';
      case 'draft': return 'Bozza';
      default: return '';
    }
  };

  export const getStatusStyle = (status, styles) => {
  switch (status) {
    case 'pending':
      return styles.pendingPayment;
    case 'canceled':
      return styles.canceledPayment;
    case 'paid':
      return styles.paidPayment;
    case 'refunded':
      return styles.refundedPayment;
    case 'suspended':
      return styles.suspendedPayment;
    case 'shipped':
      return styles.shippedPayment;
    case 'completed':
      return styles.completedPayment;
    case 'draft':
      return styles.canceledPayment;
    default:
      return {};
  }
};

export const getTextShippingType = (status) => {
    switch (status) {
      case 'download': return 'Download';
      case 'standard': return 'Corriere espresso';
      case 'localpickup': return 'Ritiro in sede';
      default: return '';
    }
  };

 export const getPaymentLabel = (paymentType) => {
    switch (paymentType) {
        case 'cashier':
            return  'Cassa' ;
        case 'tap_to_pay':
            return 'Tap to Pay';
        case 'bank':
            return 'Bonifico Bancario';
        case 'cod':
            return 'Contrassegno' ;
        case 'braintree':
            return 'Carta (Braintree)' ;
        case 'stripe':
            return  'Carta (Stripe)' ;
        case 'paypal':
            return  'PayPal';
        case 'card':
            return  'Carta di credito';
        case 'coupon':
            return  'Coupon';
        default:
            return 'Non specificato';
    }
};


 export const getBorderColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'pending': return 'orange';
      case 'expired': return 'gray';
      case 'canceled': return 'red';
      default: return 'black';
    }
  };

export const getTextColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'pending': return 'orange';
      case 'expired': return 'gray';
      case 'canceled': return 'red';
      default: return 'black';
    }
  };

  export const getReturnMethod = (status) => {
    switch (status) {
      case 'courier': return 'Corriere';
      case 'online': return 'online';
      default: return '-';
    }
  };