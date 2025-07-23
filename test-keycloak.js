const http = require('http');
const https = require('https');

console.log('🔍 Test de connectivité Keycloak...\n');

// Test 1: Vérifier si le serveur Keycloak répond
function testKeycloakServer() {
  console.log('1. Test du serveur Keycloak (jbpm.localhost:8082)...');
  
  const options = {
    hostname: 'jbpm.localhost',
    port: 8082,
    path: '/',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Serveur Keycloak accessible - Status: ${res.statusCode}`);
    console.log(`   Headers: ${JSON.stringify(res.headers)}`);
  });

  req.on('error', (err) => {
    console.error(`❌ Erreur de connexion au serveur Keycloak: ${err.message}`);
    console.error(`   Vérifiez que Keycloak est démarré sur jbpm.localhost:8082`);
  });

  req.on('timeout', () => {
    console.error('❌ Timeout lors de la connexion au serveur Keycloak');
    req.destroy();
  });

  req.end();
}

// Test 2: Vérifier la configuration OpenID du realm master
function testMasterOpenIDConfig() {
  console.log('\n2. Test de la configuration OpenID du realm master...');
  
  const options = {
    hostname: 'jbpm.localhost',
    port: 8082,
    path: '/realms/master/.well-known/openid_configuration',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Configuration OpenID du realm master accessible');
        try {
          const config = JSON.parse(data);
          console.log(`   Issuer: ${config.issuer}`);
          console.log(`   Token endpoint: ${config.token_endpoint}`);
          console.log(`   Userinfo endpoint: ${config.userinfo_endpoint}`);
        } catch (e) {
          console.log('   Configuration reçue mais non parsable');
        }
      } else {
        console.error(`❌ Configuration OpenID du realm master non accessible - Status: ${res.statusCode}`);
      }
    });
  });

  req.on('error', (err) => {
    console.error(`❌ Erreur lors du test OpenID master: ${err.message}`);
  });

  req.end();
}

// Test 3: Vérifier la configuration OpenID du realm atos
function testAtosOpenIDConfig() {
  console.log('\n3. Test de la configuration OpenID du realm atos...');
  
  const options = {
    hostname: 'jbpm.localhost',
    port: 8082,
    path: '/realms/atos/.well-known/openid_configuration',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Configuration OpenID du realm atos accessible');
        try {
          const config = JSON.parse(data);
          console.log(`   Issuer: ${config.issuer}`);
          console.log(`   Token endpoint: ${config.token_endpoint}`);
          console.log(`   Userinfo endpoint: ${config.userinfo_endpoint}`);
        } catch (e) {
          console.log('   Configuration reçue mais non parsable');
        }
      } else {
        console.error(`❌ Configuration OpenID du realm atos non accessible - Status: ${res.statusCode}`);
        console.error(`   Le realm 'atos' n'existe peut-être pas`);
      }
    });
  });

  req.on('error', (err) => {
    console.error(`❌ Erreur lors du test OpenID atos: ${err.message}`);
  });

  req.end();
}

// Test 4: Lister les realms disponibles
function listRealms() {
  console.log('\n4. Test de liste des realms...');
  
  const options = {
    hostname: 'jbpm.localhost',
    port: 8082,
    path: '/admin/realms',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`   Status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        try {
          const realms = JSON.parse(data);
          console.log('✅ Realms disponibles:');
          realms.forEach(realm => {
            console.log(`   - ${realm.realm} (${realm.displayName || 'Sans nom'})`);
          });
        } catch (e) {
          console.log('   Réponse reçue mais non parsable');
        }
      } else {
        console.error('❌ Impossible de lister les realms');
      }
    });
  });

  req.on('error', (err) => {
    console.error(`❌ Erreur lors de la liste des realms: ${err.message}`);
  });

  req.end();
}

// Test 5: Test d'authentification avec le realm master
function testMasterAuthentication() {
  console.log('\n5. Test d\'authentification avec le realm master...');
  
  const postData = new URLSearchParams({
    grant_type: 'password',
    client_id: 'admin-cli',
    username: 'admin',
    password: 'admin'
  }).toString();

  const options = {
    hostname: 'jbpm.localhost',
    port: 8082,
    path: '/realms/master/protocol/openid-connect/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`   Status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log('✅ Authentification admin réussie');
        try {
          const response = JSON.parse(data);
          console.log(`   Token type: ${response.token_type}`);
          console.log(`   Expires in: ${response.expires_in}s`);
        } catch (e) {
          console.log('   Réponse reçue mais non parsable');
        }
      } else {
        console.error('❌ Authentification admin échouée');
        try {
          const error = JSON.parse(data);
          console.error(`   Error: ${error.error}`);
          console.error(`   Description: ${error.error_description}`);
        } catch (e) {
          console.error(`   Réponse d'erreur: ${data}`);
        }
      }
    });
  });

  req.on('error', (err) => {
    console.error(`❌ Erreur lors du test d'authentification admin: ${err.message}`);
  });

  req.write(postData);
  req.end();
}

// Exécuter les tests
testKeycloakServer();
setTimeout(testMasterOpenIDConfig, 1000);
setTimeout(testAtosOpenIDConfig, 2000);
setTimeout(listRealms, 3000);
setTimeout(testMasterAuthentication, 4000);