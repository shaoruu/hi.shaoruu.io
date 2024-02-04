mod registry;
mod worlds;

use registry::get_registry;
use voxelize::{Info, Server, WsSession};

use actix::{Actor, Addr};
use actix_cors::Cors;
use actix_files::{Files, NamedFile};
use actix_web::{
    web::{self, Query},
    App, Error, HttpRequest, HttpResponse, HttpServer, Result,
};
use actix_web_actors::ws;
use hashbrown::HashMap;
use log::{info, warn};

struct Config {
    serve: String,
}

/// Entry point for our websocket route
async fn ws_route(
    req: HttpRequest,
    stream: web::Payload,
    srv: web::Data<Addr<Server>>,
    secret: web::Data<Option<String>>,
    options: Query<HashMap<String, String>>,
) -> Result<HttpResponse, Error> {
    if !secret.is_none() {
        let error = std::io::Error::new(std::io::ErrorKind::PermissionDenied, "wrong secret!");

        if let Some(client_secret) = options.get("secret") {
            if *client_secret != secret.as_deref().unwrap() {
                warn!(
                    "An attempt to join with a wrong secret was made: {}",
                    client_secret
                );
                return Err(error.into());
            }
        } else {
            warn!("An attempt to join with no secret key was made.");
            return Err(error.into());
        }
    }

    let id = if let Some(id) = options.get("client_id") {
        id.to_owned()
    } else {
        "".to_owned()
    };

    let is_transport = options.contains_key("is_transport");

    if is_transport {
        info!("A new transport server has connected.");
    }

    ws::start(
        WsSession {
            id,
            name: None,
            is_transport,
            addr: srv.get_ref().clone(),
        },
        &req,
        stream,
    )
}

/// Main website path, serving statically built index.html
async fn index(path: web::Data<Config>) -> Result<NamedFile> {
    let path = path.serve.to_owned();
    Ok(NamedFile::open(if path.ends_with("/") {
        path + "index.html"
    } else {
        path + "/index.html"
    })?)
}

async fn info(server: web::Data<Addr<Server>>) -> Result<HttpResponse> {
    let info = server.send(Info).await.unwrap();
    Ok(HttpResponse::Ok().json(info))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let registry = get_registry();

    let mut server = Server::new()
        .port(4000)
        .secret("test")
        .serve("../dist")
        .registry(&registry)
        .build();

    server
        .add_world(worlds::setup_main_world(&registry))
        .expect("Failed to add the main world");
    server
        .add_world(worlds::setup_flat_world(&registry))
        .expect("Failed to add the flat world");

    server.prepare();
    server.started = true;

    let addr = server.addr.to_owned();
    let port = server.port.to_owned();
    let serve = server.serve.to_owned();
    let secret = server.secret.to_owned();

    let server_addr = server.start();

    if !serve.is_empty() {
        info!("Attempting to serve static folder: {}", serve);
    }

    let srv = HttpServer::new(move || {
        let serve = serve.to_owned();
        let secret = secret.to_owned();

        // Only allow connections from localhost or the same IP as the server
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_origin("http://localhost:4000")
            .allowed_origin("https://hi.shaoruu.io")
            .allowed_origin("https://shaoruu.io");

        let app = App::new()
            .wrap(cors)
            .app_data(web::Data::new(secret))
            .app_data(web::Data::new(server_addr.clone()))
            .app_data(web::Data::new(Config {
                serve: serve.to_owned(),
            }))
            .route("/", web::get().to(index))
            .route("/ws/", web::get().to(ws_route))
            .route("/info", web::get().to(info));

        if serve.is_empty() {
            app
        } else {
            app.service(Files::new("/", serve).show_files_listing())
        }
    })
    .bind((addr.to_owned(), port.to_owned()))?;

    info!("🍄  Voxelize backend running on http://{}:{}", addr, port);

    srv.run().await
}
