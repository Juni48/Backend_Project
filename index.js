require('dotenv').config();

const {connect, Schema, model, Types} = require('mongoose');
const {createServer} = require('http');
const { create } = require('domain');

connect(process.env.MONGO_URI, function (err){
    if (err){
        console.error('No se pudo conectar a la base de datos');
        console.error(err);
        process.exit(1);
    } else {
        console.log('Conectado a la base de datos.');
    }
});

const PaintSchema = new Schema ({
    paint: {type: String, require: true},
    artist: {type:String, require: true},
    author: {type: Schema.Types.ObjectId, ref:'users', require: true, unique: false},
});

const UserSchema = new Schema ({
    username: {type: String, required: true, unique:true},
    email: {type:String, required: true, unique:true}
});

const PostModel = model('paints', PaintSchema);
const UserModel = model('users', UserSchema);

const server = createServer(function (request, response){
    if (request.url ==='/paints'){
        PostModel.find().populate('author').exec(function(err, paints){
            if (err){
                response.write('Request Failed');
                console.error(err);
                response.end();
            } else {
                response.write(JSON.stringify(paints));
                response.end();
            }
        });
    } else if (request.url.startsWith('/paints/users/')){
        const split = request.url.split('/');
        const UserId = split[3];
        console.log(UserId);
        PostModel.find({author: Types.ObjectId(UserId)}, function(err, paints){
            if (err){
                response.write('Request Failed');
                console.error(err);
                response.end();
            } else {
                response.write(JSON.stringify(paints));
                response.end();
            };
        });
    } else {
        response.write('Error 404: Page not found');
        response.end();
    }
});

server.listen(process.env.PORT || 8080, function(){
    console.log('Servidor Escuchando Peticiones')
});





































// new UserModel({
//     username:'Pedro',
//     email: 'Pedrito@gmail.com'
// }).save();

// new UserModel({
//     username:'Julian',
//     email: 'Julian@gmail.com'
// }).save();


// new PostModel({
//     paint: 'Mona Lisa',
//     artist: 'Leonardo Da Vinci',
//     author: Types.ObjectId('63130377c2d3804387cd2ad8')
// }).save();

// new PostModel({
//     paint: 'Noche estrellada',
//     artist: 'Vincent van Gogh',
//     author: Types.ObjectId('63130377c2d3804387cd2ad7')
// }).save();

// new UserModel({
//     username:'Juan Picos',
//     email: 'Juanpicos@gmail.com'
// }).save();

// new PostModel({
//     paint: 'Ultima Cena',
//     artist: 'Leonardo da Vinci',
//     author: Types.ObjectId('6315065ba362495a527aac38')
// }).save();

// new PostModel({
//     paint: 'Guernica',
//     artist: 'Pablo Picasso',
//     author: Types.ObjectId('6315065ba362495a527aac38')
// }).save();

// new PostModel({
//     paint: 'El grito',
//     artist: 'Edvard Munch',
//     author: Types.ObjectId('6315065ba362495a527aac38')
// }).save();

// new PostModel({
//     paint: 'Creacion de Adan',
//     artist: 'Miguel Angel',
//     author: Types.ObjectId('6315065ba362495a527aac38')
// }).save();

// new PostModel({
//     paint: 'Las meninas',
//     artist: 'Diego Velazquez',
//     author: Types.ObjectId('6315065ba362495a527aac38')
// }).save();

// new PostModel({
//     paint: 'Nacimiento de Venus',
//     artist: 'Sandro Botticelli',
//     author: Types.ObjectId('6315065ba362495a527aac38')
// }).save();

// new PostModel({
//     paint: 'El Beso',
//     artist: 'Gustav Klimt',
//     author: Types.ObjectId('6315065ba362495a527aac38')
// }).save();

// new PostModel({
//     paint: 'La Joven de la Perla',
//     artist: 'Johannes Vermeer',
//     author: Types.ObjectId('6315065ba362495a527aac38')
// }).save();

// new PostModel({
//     paint: 'La Ronda de la Noche',
//     artist: 'REMBRANDT VAN RIJN',
//     author: Types.ObjectId('6315065ba362495a527aac38')
// }).save();

// new PostModel({
//     paint: 'La Balsa de la Medusa',
//     artist: 'THÉODORE GÉRICAULT',
//     author: Types.ObjectId('6315065ba362495a527aac38')
// }).save();