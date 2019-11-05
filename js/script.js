const vm = new Vue({
  el: "#app",
  data: {
    produtosList: [],
    produtosInformacao: [],
    produto: "",
    estoque: [],
    alerta: false,
    quantidade: 0,
    carrinho: "",
    carrinhoProdutos: [],
    total: 0,
  },
  filters: {
    conversaoPreco(valor) {
      if (valor || valor === 0) {
        return valor.toLocaleString("pt-BR", {
          style: 'currency',
          currency: 'BRL'
        })
      }
    }
  },
  methods: {
    feathProdutos() {
      const url = "./api/produtos.json"
      fetch(url)
        .then(response => response.json())
        .then(produtos => {
          this.produtosList = produtos
          produtos.forEach(produto => {
            this.feathProdutosInfo(produto.id)
          })
        })
    },
    feathProdutosInfo(id) {
      const url = `./api/produtos/${id}/info.json`
      fetch(url)
        .then(response => response.json())
        .then(produtosInfo => {
          this.produtosInformacao.push(produtosInfo)
        })
    },
    estoqueProdutos() {
      if (!this.estoque.length > 0) {
        this.produtosInformacao.forEach((produto) => {
          this.estoque.push({
            id: produto.id,
            estoque: produto.estoque
          })
        })
      }
    },
    produtoModal(id) {
      this.produto = this.produtosInformacao.find((produto) => {
        return produto.id === id
      })
    },
    adicionarProdutos(id) {
      this.carrinho = true
      this.quantidadeProdutos()
      this.totalProdutos()
      this.carrinhoCompra()
      this.atualizarEstoque(id)
      this.alerta = true
      setTimeout(() => {
        this.alerta = false
      }, 1500)
    },
    removerProdutos(index, id) {
      this.carrinho = false
      this.quantidadeProdutos()
      this.totalProdutos(index)
      this.carrinhoCompra(index)
      this.atualizarEstoque(id)
    },
    atualizarEstoque(id) {
      let x = this.produtosInformacao.findIndex((produto) => {
        return produto.id === id
      })

      let y = this.estoque.findIndex((produto) => {
        return produto.id === id
      })

      if (this.carrinho) {
        this.estoque[x].estoque--
      } else {
        this.estoque[x].estoque++
      }

      this.estoque[y].estoque = this.produtosInformacao[x].estoque
    },
    carrinhoCompra(index) {
      if (this.carrinho) {
        this.carrinhoProdutos.push({
          id: this.produto.id,
          produto: this.produto.nome,
          preco: this.produto.preco,
        }, )
      } else {
        this.carrinhoProdutos.splice(index, 1)
      }
    },
    quantidadeProdutos() {
      if (this.carrinho) {
        this.quantidade++
      } else {
        this.quantidade--
      }
    },
    totalProdutos(index) {
      if (this.carrinho) {
        this.total += this.produto.preco
      } else {
        this.total -= this.carrinhoProdutos[index].preco
      }
    },
    estoqueLocalStorage() {
      if (window.localStorage.estoque) {
        this.estoque = JSON.parse(window.localStorage.estoque)
      }
    },
    carrinhoLocalStorage() {
      if (window.localStorage.carrinhoProdutos) {
        this.carrinhoProdutos = JSON.parse(window.localStorage.carrinhoProdutos)
        this.quantidade = JSON.parse(window.localStorage.quantidade)
        this.total = JSON.parse(window.localStorage.total)
      }
    },
  },
  watch: {
    carrinhoProdutos() {
      window.localStorage.carrinhoProdutos = JSON.stringify(this.carrinhoProdutos)
      window.localStorage.quantidade = JSON.stringify(this.quantidade)
      window.localStorage.total = JSON.stringify(this.total)
    },
    estoque() {
      window.localStorage.estoque = JSON.stringify(this.estoque)
      console.log('teste')
    },
  },
  created() {
    this.feathProdutos()
    this.carrinhoLocalStorage()
  },
  updated() {
    this.estoqueProdutos()
    console.log(this.estoque)
  }
})