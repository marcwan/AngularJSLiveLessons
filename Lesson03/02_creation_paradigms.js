

function ObjectClass () {

    this.net_connection = NetConnection.create();

}



function ObjectClass () {

    var factory = _g_serviceFactory.getFactory();

    this.net_connection = factory.get(TYPE.NetConnection);

}


function ObjectClass ($net_connection) {


}
