const Reader = require('@maxmind/geoip2-node').Reader;
const path = require('path');
const dbPath = path.join(__dirname, './GeoLite2/GeoLite2-Country.mmdb');

module.exports.getLocation = async function (ip) {
    try {
        const reader = await Reader.open(dbPath);
        const res = reader.country(ip);
        return res.country.isoCode;
    } catch (err) {
        // Handle AddressNotFoundError explicitly
        if (err.name === 'AddressNotFoundError') {
            console.error('Error: ', `IP: ${ip} not in DB`);
            return 'N/A'; // Return 'N/A' if IP address is not found
        }

        return err;
    }
};
