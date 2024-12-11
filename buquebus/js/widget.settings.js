// -*- coding: utf-8 -*-
var widgetSettings = (function () {
  //spacing 
  
  
        var portalConfig = [
            {
              PortalId:1,
              UserService: "buquebus",
              BranchCode: "arwebnoart",
              UrlDomainNS: "https://turismo.buquebus.com",
              CurrentCulture: "es-AR",
              SalesChannel: "",
              BusinessUnit: "",
              ClientId: "",
              SessionTokenSSO: "",
              IsLinkGenerator: false,
              StaticContentEnable: true,
              EnableHotelNewFrontEnd: true,
            },
          ];
          var widgetProductsSettings = [
            {
              AirFlexDateEnabled: false,
              HotelsMaxAgeChild: 12,
              TravelExtraMaxDaysAllowedSearch: 365,
              MaxPassengerSearch: 12,
              PromoCodeAllowed: false,
              AirAdvancedPurchaseDays: 2,
              HotelAdvancedPurchaseDays: 3,
              TravelExtraAdvancedPurchaseDays: 2,
              VehicleAdvancedPurchaseDays: 2,
            },
          ];
           
  
  var listCodes = [];
  var extraProductTypes = [
    {
      Id: -1,
      TypeId: 1,
      Name: "Actividades acuáticas",
      Checked: !1,
      ActionType: "NA",
    },
    {
      Id: -1,
      TypeId: 12,
      Name: "Actividades de Golf",
      Checked: !1,
      ActionType: "NA",
    },
    {
      Id: -1,
      TypeId: 15,
      Name: "Actividades de Ski",
      Checked: !1,
      ActionType: "NA",
    },
    { Id: -1, TypeId: 26, Name: "Almuerzo", Checked: !1, ActionType: "NA" },
    { Id: -1, TypeId: 0, Name: "Aventura", Checked: !1, ActionType: "NA" },
    { Id: -1, TypeId: 3, Name: "Boletos", Checked: !1, ActionType: "NA" },
    {
      Id: -1,
      TypeId: 16,
      Name: "Boletos de Aerosilla",
      Checked: !1,
      ActionType: "NA",
    },
    { Id: -1, TypeId: 20, Name: "Bus", Checked: !1, ActionType: "NA" },
    { Id: -1, TypeId: 29, Name: "Campamento", Checked: !1, ActionType: "NA" },
    {
      Id: -1,
      TypeId: 11,
      Name: "Casamientos",
      Checked: !1,
      ActionType: "NA",
    },
    { Id: -1, TypeId: 2, Name: "Cena", Checked: !1, ActionType: "NA" },
    { Id: -1, TypeId: 21, Name: "Cena Show", Checked: !1, ActionType: "NA" },
    { Id: -1, TypeId: 22, Name: "City Tour", Checked: !1, ActionType: "NA" },
    {
      Id: -1,
      TypeId: 14,
      Name: "Cobro a tarjetas de credito",
      Checked: !1,
      ActionType: "NA",
    },
    { Id: -1, TypeId: 23, Name: "Comida", Checked: !1, ActionType: "NA" },
    { Id: -1, TypeId: 28, Name: "Curso", Checked: !1, ActionType: "NA" },
    {
      Id: -1,
      TypeId: 24,
      Name: "Entrevistas",
      Checked: !1,
      ActionType: "NA",
    },
    {
      Id: -1,
      TypeId: 13,
      Name: "Extras de Aereos",
      Checked: !1,
      ActionType: "NA",
    },
    { Id: -1, TypeId: 4, Name: "Golf", Checked: !1, ActionType: "NA" },
    {
      Id: -1,
      TypeId: 6,
      Name: "Otros servicios",
      Checked: !1,
      ActionType: "NA",
    },
    { Id: -1, TypeId: 30, Name: "Paquete", Checked: !1, ActionType: "NA" },
    {
      Id: -1,
      TypeId: 10,
      Name: "Parques de atracciones",
      Checked: !1,
      ActionType: "NA",
    },
    {
      Id: -1,
      TypeId: 7,
      Name: "Paseos de compras",
      Checked: !1,
      ActionType: "NA",
    },
    {
      Id: -1,
      TypeId: 18,
      Name: "Seguro de viaje",
      Checked: !1,
      ActionType: "NA",
    },
    { Id: -1, TypeId: 25, Name: "Show", Checked: !1, ActionType: "NA" },
    { Id: -1, TypeId: 8, Name: "Spa", Checked: !1, ActionType: "NA" },
    {
      Id: -1,
      TypeId: 9,
      Name: "Tours y Excursiones",
      Checked: !1,
      ActionType: "NA",
    },
    { Id: -1, TypeId: 5, Name: "Transfers", Checked: !1, ActionType: "NA" },
    {
      Id: -1,
      TypeId: 27,
      Name: "Traslado Aéreo",
      Checked: !1,
      ActionType: "NA",
    },
    { Id: -1, TypeId: 17, Name: "Tren", Checked: !1, ActionType: "NA" },
    { Id: -1, TypeId: 19, Name: "Visa", Checked: !1, ActionType: "NA" },
  ];
  var geoLocationProducts = [
    { Product: "AirProduct", Enabled: !1 },
    { Product: "HotelProduct", Enabled: !1 },
    { Product: "ExtraProduct", Enabled: !1 },
    { Product: "AirHotelProduct", Enabled: !1 },
    { Product: "BusProduct", Enabled: !1 },
    { Product: "BusHotelProduct", Enabled: !1 },
    { Product: "AirCarProduct", Enabled: !1 },
  ];

  return {
    portalConfig: portalConfig,
    listCodes: listCodes,
    geoLocationProducts: geoLocationProducts,
    extraProductTypes: extraProductTypes,
    widgetProductsSettings: widgetProductsSettings,
  };
})();
var Resources = {
  DateDeparture: "Fecha de partida",
  DateArrival: "Fecha de regreso",
  DateCheckin: "Fecha de entrada",
  DateCheckout: "Fecha de salida",
  DateDropoff: "Fecha de devolución",
  DatePickup: "Fecha de alquiler",
  EnterCity: "Ingrese una ciudad",
  EnterAirport: "Ingrese un aeropuerto",
  CircuitDuration: "{0} a {1} días",
  CircuitDurationMore: "Más de 20 días",
  AirportText: "Aeropuerto",
  CityText: "Ciudad",
  ZoneText: "Zona",
  EnterNeighborhood: "Ingrese una ciudad",
};
function loadPortalConfig() {
  var portalConfig = eval($("input[id='PortalConfig']").val());
  return (
    null != widgetSettings.portalConfig &&
    (($PortalId = widgetSettings.portalConfig[0].PortalId),
    ($UserService = widgetSettings.portalConfig[0].UserService),
    ($BranchCode = widgetSettings.portalConfig[0].BranchCode),
    ($UrlDomainNS = widgetSettings.portalConfig[0].UrlDomainNS),
    ($IsLinkGenerator = widgetSettings.portalConfig[0].IsLinkGenerator),
    ($BusinessUnit = widgetSettings.portalConfig[0].BusinessUnit),
    ($SalesChannel = widgetSettings.portalConfig[0].SalesChannel),
    ($ClientId = widgetSettings.portalConfig[0].ClientId),
    ($SessionTokenSSO = widgetSettings.portalConfig[0].SessionTokenSSO),
    ($StaticContentEnable = widgetSettings.portalConfig[0].StaticContentEnable),
    ($EnableHotelNewFrontEnd =
      widgetSettings.portalConfig[0].EnableHotelNewFrontEnd),
    ($CurrentCulture = widgetSettings.portalConfig[0].CurrentCulture),
    ($ListCodes = widgetSettings.listCodes),
    ($GeoLocationProducts = widgetSettings.geoLocationProducts),
    ($IsMobile = window.innerWidth <= 767),
    ($jsonPax = { Adults: "1", Childs: "0", Infants: "0" }),
    ($jsonPaxRoom = { Room: "1", Adults: "1", Childs: "0", AgeChilds: "" }),
    ($jsonArrayPaxRoom = [$jsonPaxRoom]),
    !0)
  );
}
$(document).ready(function () {
  loadPortalConfig()
    ? (($AirFlexDateEnabled =
        widgetSettings.widgetProductsSettings[0].AirFlexDateEnabled),
      ($HotelsMaxAgeChild =
        widgetSettings.widgetProductsSettings[0].HotelsMaxAgeChild),
      ($TravelExtraMaxDaysAllowedSearch =
        widgetSettings.widgetProductsSettings[0]
          .TravelExtraMaxDaysAllowedSearch),
      ($MaxPassengerSearch =
        widgetSettings.widgetProductsSettings[0].MaxPassengerSearch),
      ($PromoCodeAllowed =
        widgetSettings.widgetProductsSettings[0].PromoCodeAllowed),
      ($AirAdvancedPurchaseDays =
        widgetSettings.widgetProductsSettings[0].AirAdvancedPurchaseDays),
      ($HotelAdvancedPurchaseDays =
        widgetSettings.widgetProductsSettings[0].HotelAdvancedPurchaseDays),
      ($TravelExtraAdvancedPurchaseDays =
        widgetSettings.widgetProductsSettings[0]
          .TravelExtraAdvancedPurchaseDays),
      ($VehicleAdvancedPurchaseDays =
        widgetSettings.widgetProductsSettings[0].VehicleAdvancedPurchaseDays),
      setTimeout(function () {
        initWidget("#widget-01");
      }, 300))
    : $("#widget-01").show();
});

