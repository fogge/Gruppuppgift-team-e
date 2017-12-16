class Game {
  constructor() {
    this.board = new Board(this);
    this.player1;
    this.player2;
    this.renderInputForms();
    this.myButtons();
  }

  renderInputForms() {
    $('main').html(`
      <h2>Spela 4 i Rad</h2>
        <div class="row playerone pt-5">
          <h4 class="col-12">Spelare 1:</h4>
          <div class="form-group col-7 col-md-5 col-lg-4 pr-0">
            <input type="text" class="form-control" id="player1" placeholder="Ange spelare 1">
          </div>

          <div class="col-5 col-md-3 col-lg-2 pr-1">
            <select class="custom-select bg-warning text-dark">
              <option selected>Spelartyp</option>
              <option value="1">Människa</option>
              <option value="2">Dator</option>
            </select>
          </div>
        </div>

        <div class="row playerone pt-2">
          <h4 class="col-12">Spelare 2:</h4>
          <div class="form-group col-7 col-md-5 col-lg-4 pr-0">
            <input type="text" class="form-control" id="player2" placeholder="Ange spelare 2">
          </div>

          <div class="col-5 col-md-3 col-lg-2 pr-1">
            <select class="custom-select bg-danger text-white">
              <option selected>Spelartyp</option>
              <option value="1">Människa</option>
              <option value="2">Dator</option>
            </select>
          </div>
        </div>

        <div class="row mt-3 mb-5">
          <div class="col-12">
            <a id="startbutton" class="btn btn-success btn-lg" href="#l" role="button">Starta spel</a>
          </div>
        </div>
      `);
  }

  renderBase() {
    $('main').html(`
        <div class="d-flex flex-column flex-lg-row justify-content-around col-12 showplayersscale">
          <h3 class="bg-warning py-3 text-white playerFont text-center mr-lg-5 col-lg-4">${this.player1.name}</h3>
          <h1 class="pt-2 playerFont text-center"> VS </h1>
          <h3 class="bg-danger py-3 text-white playerFont text-center ml-lg-5 col-lg-4">${this.player2.name}</h3>
        </div>
        <div class="row mt-3">
          <div class="col-12">
            <div id="board-holder">
              <div id="board"></div>
            </div>
          </div>
        </div>

        <div class="row justify-content-center quitbuttonscale">
        <div class="col-8 mt-4">
        <button id="newGameBtn" type="button" class="btn btn-danger btn-lg btn-block"><a href="/play">Avsluta spel</a></button>
        </div>
        </div>
        `);
  }

  myButtons() {
    let that = this;
    $('#startbutton').on('click', function () {
      let player1 = $('#player1').val() ? $('#player1').val() : "John Doe";
      let player2 = $('#player2').val() ? $('#player2').val() : "John Doe";
      that.startGameSession(player1, player2);
      that.board.activate(true);
    })
  }

  startGameSession(player1Name, player2Name) {
    this.player1 = new Player(player1Name, 'yellow');
    this.player2 = new Player(player2Name, 'red');
    this.renderBase();
    this.board.render();
    this.board.setupPlayers();
    this.eventHandlers();
  }

  eventHandlers() {
    let that = this;
    $(document).on('click', 'rect', function () {
      const targetCircle = $(this).siblings('circle');
      if (that.board.isClickable(targetCircle)) {
        const color = that.board.getCurrentTurn();
        that.board.putDisc(targetCircle, color);
        that.board.changeTurn();
        that.board.checkWinner(color);
        that.board.isFullBoard();
      }
    });

    //hoovering disc effect
    let hoverCircle;
    $(document).on({
      mouseenter: function () {
        let targetCircle = $(this).siblings('circle');
        let playColumn = (targetCircle[0].cx.baseVal.value - 50) / 100;
        for (let y = 5; y >= 0; y--) {
          if (that.board.places[playColumn][y].color === 'white') {
            hoverCircle = $("circle[cx=" + that.board.places[playColumn][y].cx + "][cy=" + that.board.places[playColumn][y].cy + "]");
            break;
          }
        }
        hoverCircle.addClass((that.board.turn == "yellow" ? "hoverYellow" : "hoverRed"));
      },
      mouseleave: function () {
        hoverCircle.removeClass((that.board.turn == "yellow" ? "hoverYellow" : "hoverRed"));
      }
    }, 'rect');
  }
}
