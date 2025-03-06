La pràctica no es troba finalitzada, srry panta...
Els serveis de totes les possibles accions de l'usuari estàn fetes, el que faltaria és fer els controladors que utilitzin els serveis i la ruta de cada controlador, en si la lògica està finalitzada però bno ja t'ho trobaras, un altre cop srry

# Api Bancària

## Base de dades

Per aquesta activitat es farà servir una base de dades Postgres encapsulada en un contenidor Docker.

#### Engegar base de dades

Per engegar la base de dades, amb el Docker activat, s'ha d'executar:

```bash
docker-compose up
```

## Entitats

En aquesta part explicaré les diferents entitats que he creat

**User**: El user serà la entitat que representa als diferents usuaris que podràn accedir a la api tant clients com administradors, els quals tindràn els seguents atributs:
- **Id**: Identificador dels usuaris que s'utilitzarà a la BBDD com a clau primària
- **Password** *(Encriptada amb SHA-512)*
- **Name**
- **Surname**
- **Email**: L'email s'utilitzarà per iniciar sessio, aquest serà únic a la bbdd
- **isAdmin**: Aquest atribut ens indicarà si l'usuari és administrador o no

Els usuaris que no són administradors podràn fer les seguents accions:
- **Registrar-se**
- **Iniciar sessió**
- **Crear compte**
- **Crear targeta**
- **Fer transferència**
- **Pagar amb targeta**
- **Liquidar saldo pendent**
- **Solicitar extracte mensual**
- **Cambiar contrasenya**
- **Bloquejar targeta**

A part de tot això els usuaris administradors també podrán:
- **Modificar dades usuaris**
- **Eliminar usuari**
- **Modificar tasas de cambio entre divisas**  


**Account**: Account és la entitat que representara els diferents tipus de comptes que tindrem al nostre sistema, aquest comptara amb els seguents atributs:

- **Account Number**: Número de compte, aquest sera un identificador unic
- **Currency**
- **Balance**
- **Account Type**
- **Daily Limit**

**Card**: Card és la entitat que representara els diferents tipus de targetes que tindrem al nostre sistema, aquest comptara amb els seguents atributs:

- **Card Number**
- **Linked Account**
- **Card Type**
- **Card Limit**
- **Pin**

**Transaction**: 

**Conversion Rate**: 

**Operation**: 


## Controladors

#### Controladors Get
- **Users Get Controller**: Obtenir tots els usuaris de la BBDD, aquest controlador es crida desde la ruta ```localhost:5004/api/users```. Per poder obtenir la llista de usuaris s'haura de haver fet login amb un usuari que sigui admin i que aquesta crida tingui al header el token generat.

    Un exemple de solicitar tots els usuaris al header de la crida a la ruta ```localhost:5004/api/users``` haurà de contenir:
    ```json
    {
        "Authorization":"token retornat per login de admin",  
    }   
    ```

- **User Get Controller**: Obtenir un usuari de la BBDD per id, aquest controlador es crida desde la ruta ```localhost:5004/api/users/:id```. Per poder obtenir l'usuari s'haura de haver fet login amb un usuari que sigui admin i que aquesta crida tingui al header el token generat.

    Un exemple de solicitar l'usuari al header de la crida a la ruta ```localhost:5004/api/users/1``` haurà de contenir:
    ```json
    {
        "Authorization":"token retornat per login de admin",  
    }   
    ```
- **Accounts Get Controller**: Obtenir tots els comptes de la BBDD
- **Account Get Controller**: Obtenir un compte per numero de compte
- **Cards Get Controller**: Obtenir totes les targetes de la BBDD
- **Card Get Controller**: Obtenir una targeta per numero de targeta
- **Rate Get Controller**: Obtenir el conversion rate per unes divises en concret

#### Controladors Put
- **User Put Controller**: Serveix per modificar les dades d'un usuari per id, la ruta d'aquest controlador és ***PUT*** ```localhost:5004/api/users/:id```. Per poder cridar a aquest controlador s'haurà d'estar logejat, un usuari que no sigui administrador només podrà modificar dades del seu propi usuari, en cambi un administrador pot modificar les dades de qualsevol usuari a més a més de poder donar-li drets d'administrador o treure-ls, un usuari normal no podra fer-se administrador a si mateix. Si es vol canviar l'email també es revisarà si aquest existeix ja a la bbdd Al body de la crida https s'haurà d'indicar quins camps es volen modificar, per exemple un usuari normal podria fer la seguent crida a la ruta ***PUT*** ```localhost:5004/api/users/:id```:
    ```json
    {
        "name" :"Pantaleon",
        "surname" : "El Mejor",
        "password": "AmoProgramar11"
    }
    ```
- **Account Put Controller**: Modificar dades d'un compte per id
- **Card Put Controller**: Modificar dades d'una targeta per id
- **Rate Put Controller**: Modificar el canvi de divisa

#### Controladors Post
- **Register Post Controller**: Aquest controlador es crida desde la ruta ***POST*** ```localhost:5004/api/register```. Aquest controlador el pot cridar qualsevol ja que no requereix d'estar logejat, serveix per crear un nou usuari, indicant al body els seguents parametres:
    - email  Aquest ha de ser unic a la base de dades, en cas de no ser-ho el controlador retorna un 409 indicant que ja existeix un usuari amb aquest email
    - name
    - surname
    - password: Aquesta s'encripta i es guarda a la BBDD hashejada, a part, la contrasenya ha de contenir mínim 3 caràcters que no siguin espais

    Un exemple de registrar un usuari seria fer una crida a la ruta mencionada amb el seguent body:
    ```json
    {
        "email":"pantasito@gmail.com",
        "name" :"Pantaleon",
        "surname" : "El Mejor",
        "password": "AmoProgramar11"
    }   
    ```
    L'usuari creat sempre tindra permisos d'usuari normal no d'administrador, per tornar-se administrador la unica forma serà que un usuari que ja sigui administrador el faci administrador mitjançant la ruta ***put*** ```localhost:5004/api/users/:id``` o sino l'administrador de la bbdd desde la bbdd directament.
    
- **Login Post Controller**: Aquest controlador es crida desde la ruta ```localhost:5004/api/login```. Aquest controlador el pot cridar qualsevol ja que no requereix d'estar logejat, serveix per iniciar sessió, indicant al body els seguents parametres:
    - email
    - password

    Si no existeix cap usuari amb l'email indicat o la contrasenya introduida és erronea retorna un 404, en cas de ser tot correcte retorna el token JWT
    Un exemple de inici de sessio de un usuari seria fer una crida a la ruta ```localhost:5004/api/login```  amb el seguent body:
    ```json
    {
        "email":"pantasito@gmail.com",
        "password":"AmoProgramar11"
    }   
    ```
    
- **Account Post Controller**: Crear un nou compte
- **Card Post Controller**: Crear una nova targeta
- **Rate Post Controller**: Crear un nou canvi de divisa

#### Controladors Delete
- **User Delete Controller**: Serveix per eliminar un usuari per ID, nomes els admins poden eliminar usuaris a part de un usuari a si mateix. Aquest controlador es crida desde la ruta ```localhost:5004/api/users/:id```

- **Account Delete Controller**: Eliminar un compte per numero de compte
- **Card Delete Controller**: Eliminar una targeta per numero de targeta




