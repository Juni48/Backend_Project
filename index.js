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