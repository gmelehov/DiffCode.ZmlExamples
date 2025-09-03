var ZmlApp = { };


Ext.define('Zml.Param', {

  scopeId: null,
  scopeType: null,
  field: null,
  as: null,
  record: null,
  value: undefined,
  defaultValue: undefined,
  isParam: null,


  constructor: function (config)
  {
    if (config)
    {
      this.scopeId = config.scopeId;
      this.scopeType = config.scopeType;
      this.field = config.field;
      this.as = config.as || config.field;
      this.record = config.record;
      this.value = config.value;
      this.defaultValue = config.value;
      this.isParam = true;
    };
  },


  compute: function ()
  {
    var t = this;
    var scope = null;
    var ret = undefined;
    if (window['ZmlApp'] && window['ZmlApp'].CTRL)
    {
      var ctrl = window['ZmlApp'].CTRL;
      var view = window['ZmlApp'].VIEW;


      switch (t.scopeType)
      {

        case 'form':
          scope = view.query('#' + t.scopeId)[0];
          if (scope)
          {
            ret = LogX.Forms.GetFormInputValue(scope.query('#' + t.field)[0]);
          };
          break;



        case 'grid':
          scope = view.query('grid[itemId=' + t.scopeId + ']')[0];
          if (scope && scope.getSelectionModel())
          {
            if (t.record == null || t.record == undefined)
            {
              var selected = scope.getSelectionModel().getSelection()[0];
              ret = selected ? selected.get(t.field) : -1;
            }
            else
              if (!isNaN(parseInt(t.record)))
              {
                var foundRecord = scope.getStore().getAt(t.record);
                ret = foundRecord ? foundRecord.get(t.field) : -1;
              };
          };
          break;



        case 'tree':
          scope = view.query('CommonTree[itemId=' + t.scopeId + ']')[0];
          if (scope && scope.getSelectionModel())
          {
            if (t.record == null || t.record == undefined)
            {
              var selected = scope.getSelectionModel().getSelection()[0];
              ret = selected ? selected.get(t.field) : -1;
            }
            else
              if (!isNaN(parseInt(t.record)))
              {
                var foundRecord = scope.getStore().getAt(t.record);
                ret = foundRecord ? foundRecord.get(t.field) : -1;
              };
          };
          break;



        case 'dialogform':
          if (window['ZmlApp'].currDialog != {})
          {
            var form = window['ZmlApp'].currDialog.SimpleForm;
            if (form)
            {
              scope = form;
              ret = form.GetInputValue(form.query('#' + t.field)[0]);
            };
          };
          break;



        case 'dialoggrid':
          if (window['ZmlApp'].currDialog != {})
          {
            var wind = window['ZmlApp'].currDialog;
            scope = ctrl.FindGrid(t.scopeId);
            if (scope && scope.getSelectionModel())
            {
              if (t.record == null || t.record == undefined)
              {
                var selected = scope.getSelectionModel().getSelection()[0];
                ret = selected ? selected.get(t.field) || selected.raw[t.field] : -1;
              }
              else
                if (!isNaN(parseInt(t.record)))
                {
                  var foundRecord = scope.getStore().getAt(t.record);
                  ret = foundRecord ? foundRecord.get(t.field) || foundRecord.raw[t.field] : -1;
                };
            };
          };
          break;



        case 'combo':
          var found = view.query('combobox[itemId=' + t.scopeId + ']')[0];
          if (found)
          {
            switch (t.field)
            {
              case 'descrField':
                ret = found.getDescriptionValue();
                break;

              case 'displayField':
                ret = found.getDisplayValue();
                break;

              case 'valueField':
              case 'value':
                ret = found.getValue();
                break;

              default:
                ret = found.lastSelection.map(function (m)
                {
                  return m.data[t.field]
                });
                break;
            };
          };
          break;



        case 'list':
          var found = view.query('CommonList[itemId=' + t.scopeId + ']')[0];
          if (found)
          {
            switch (t.field)
            {
              case 'descrValue':
                ret = ctrl.FindProp({ itemId: t.scopeId, from: 'list', name: 'descrValue' });
                break;

              case 'displayValue':
                ret = ctrl.FindProp({ itemId: t.scopeId, from: 'list', name: 'displayValue' });
                break;

              case 'secondaryValue':
                ret = ctrl.FindProp({ itemId: t.scopeId, from: 'list', name: 'secondaryValue' });
                break;

              case 'iconValue':
                ret = ctrl.FindProp({ itemId: t.scopeId, from: 'list', name: 'iconValue' });
                break;

              case 'colorValue':
                ret = ctrl.FindProp({ itemId: t.scopeId, from: 'list', name: 'colorValue' });
                break;

              case 'value':
                ret = ctrl.FindProp({ itemId: t.scopeId, from: 'list', name: 'value' });
                break;

              default:
                ret = found.HasSelection() ? found.getSelectionModel().getSelection()[0].data[t.field] : null;
                break;
            };
          };
          break;



        case 'auth':
          ret = Ext.util.Cookies.get('SessionID');
          break;



        case 'input':
          var qrypart = '[itemId=' + t.scopeId + ']';
          var qry = 'field' + qrypart + ', DateSet' + qrypart + ', NumberSet' + qrypart + ', MonthField' + qrypart;
          var found = view.query(qry)[0];
          if (found)
          {
            if (t.field)
            {
              switch (t.field)
              {
                case 'descrField':
                  ret = found.getDescriptionValue();
                  break;

                case 'displayField':
                  ret = found.getDisplayValue();
                  break;

                case 'valueField':
                case 'value':
                  ret = found.getValue();
                  break;

                default:
                  ret = found.lastSelection.map(function (m)
                  {
                    return m.data[t.field]
                  });
                  break;
              };
            }
            else
            {
              ret = found.getValue();
            };            
          };
          break;



        case 'editor':
          var found = ctrl.FindEditor(t.scopeId);
          if (found)
          {
            ret = found.GetEditorText();
          };
          break;



        case 'variable':
          ret = ctrl.EvalVariable({
            id: t.scopeId,
            prop: t.field,
            index: t.record
          });
          break;





        default:
          break;
      };
    };

    if (t.defaultValue == undefined)
    {
      t.value = ret;
    }
    else
    {
      t.value = t.defaultValue;
    };
  },


  getIsParam: function ()
  {
    var t = this;
    return t.isInstance;
  },


  setIsParam: function (value)
  {
    var t = this;
    t.isParam = t.isInstance;
  },


  Compute: function ()
  {
    this.compute();
  },


  IsEqualTo: function (other)
  {
    var me = this;
    if (me.isParam && other && other.isParam)
    {
      var result = true;
      result &= me.scopeId === other.scopeId;
      result &= me.scopeType === other.scopeType;
      result &= me.field === other.field;
      result &= me.as === other.as;
      return result;
    };
  }
});



/** КОНФИГУРАТОР ПРИВЯЗКИ УПРАВЛЯЕМОГО ЭЛЕМЕНТА РАЗМЕТКИ К СВОЕМУ ХОСТ-ОБЪЕКТУ */
Ext.define('Zml.ContextBinder', {

  extend: 'Ext.Component',


  mixins: {
    observable: 'Ext.util.Observable',
  },


  /** Хост-объект, обнаруженный текущей реализацией метода hostLocator */
  HOST: null,
  /** Плагин, подключенный к управляемому элементу разметки, в котором определена эта привязка */
  PLUGIN: null,
  /** Сводка о работе этой привязки */
  Summary: {
    callsCount: 0,
    lastResult: [],
  },



  config: {
    /** Тип хост-объекта */
    hostType: null,
    /** 
     * Идентификатор хост-объекта.
     * Может быть равным null, если управляемый элемент находится непосредственно
     * внутри своего хост-объекта. В этом случае поиск хост-объекта 
     * будет выполняться через this.up(hostType) и будет невозможен
     * для невизуальных хост-объектов типа source и т.п. 
     */
    hostId: null,
    /** Событие, генерируемое хост-объектом, определяющее поведение управляемого элемента разметки */
    hostEvent: null,
    /** Предыдущее значение свойства hostEvent (до его замены на текущее) */
    lastHostEvent: null,
    /** Признак наличия сконфигурированного хост-объекта (факт того, что хост-объект найден и сконфигурирован) */
    isHostConfigured: false,
    /** Признак отключенной привязки, отсоединенной от своих плагинов/элементов/объектов */
    isDetached: false,
    /** Признак того, что данный объект является экземпляром своего класса */
    isContextBinder: true
  },



  /**
   * Сеттер для свойства hostType. 
   * Генерирует событие hostTypeChanged при изменении свойства.
   * @param {any} value
   */
  setHostType: function (value)
  {
    var oldvalue = this.getHostType();
    this.hostType = value;
    if (oldvalue !== value)
    {
      this.fireEvent('hostTypeChanged', this, oldvalue, value);
    };
  },

  /**
   * Сеттер для свойства hostId. 
   * Генерирует событие hostIdChanged при изменении свойства.
   * @param {any} value
   */
  setHostId: function (value)
  {
    var oldvalue = this.getHostId();
    this.hostId = value;
    if (oldvalue !== value)
    {
      this.fireEvent('hostIdChanged', this, oldvalue, value);
    };
  },

  /**
   * Сеттер для свойства hostEvent. 
   * Генерирует событие hostEventChanged при изменении свойства.
   * @param {any} value
   */
  setHostEvent: function (value)
  {
    var me = this;
    me.lastHostEvent = me.getHostEvent();
    me.hostEvent = value;
    if (me.getLastHostEvent() != value)
    {
      me.fireEvent('hostEventChanged', me, me.lastHostEvent, value);
    };
  },





  initComponent: function (config)
  {
    var me = this;
    me.callParent(arguments);
    me.initConfig(config);

    me.mixins.observable.constructor.call(me, config);
    me.addEvents('created', 'hostTypeChanged', 'hostIdChanged', 'hostEventChanged', 'hostLocated', 'hostConfigured', 'executed');

    me.on({
      created: me.OnCreated,
      hostTypeChanged: me.OnHostTypeChanged,
      hostIdChanged: me.OnHostIdChanged,
      hostEventChanged: me.OnHostEventChanged,
      hostLocated: me.OnHostLocated,
      hostConfigured: me.OnHostConfigured,
      executed: me.OnExecuted,
      beforedestroy: me.OnBeforeDestroy,
      destroy: me.OnDestroy,
      scope: me
    });

    me.fireEvent('created', me);
  },




  /** 
   * Заглушка для динамически конструируемого метода, 
   * выполняющего поиск хост-объекта по его текущим
   * параметрам, заданным в свойствах hostType, hostId.
   */
  hostLocator: null,

  /**
   * Выполняет первый поиск хост-объекта и первое создание
   * динамического метода hostLocator.
   * Выполняется только в случае, если свойство hostType
   * содержит значение, И метод hostLocator еще не инициализирован.
   * После выполнения этих действий запускает метод tryLocateHost.
   */
  initHostLocator: function ()
  {
    var me = this;
    if (me && !!me.hostType && me.hostLocator === null)
    {

      switch (me.hostType)
      {

        /// Если искомый хост-объект - источник данных...
        case 'source':
          me.hostLocator = function ()
          {
            return Ext.getStore(me.hostId);
          };
          break;


        /// Если искомый хост-объект - список с данными...
        case 'list':
          me.hostLocator = function ()
          {
            /// Проверяем принципиальную возможность выполнения поиска визуального элемента,
            /// используем полученное значение при поиске хост-объекта...
            var canQuery = window['ZmlApp'] && window['ZmlApp'].VIEW && typeof window['ZmlApp'].VIEW.query === 'function';

            /// Получаем ссылку на основное представление, в котором расположены все визуальные элементы...
            var view = window['ZmlApp'].VIEW;

            /// Формируем универсальный селектор для поиска элемента по его itemId, равному текущему свойству hostId...
            var itemIdSelector = '[itemId=' + me.getHostId() + ']';

            /// Проверяем принципиальную возможность выполнения поиска типа this.up(...)
            var hasUpMethod = !!me.PLUGIN && !!me.PLUGIN.cmp && typeof me.PLUGIN.cmp.up === 'function';


            if (!!me.getHostId())
            {
              if (!!canQuery)
              {
                var query = view.query('CommonList' + itemIdSelector);
                if (Array.isArray(query))
                {
                  return query[0];
                };
              };
            }
            else if (hasUpMethod)
            {
              return me.PLUGIN.cmp.up('CommonList');
            };
          };
          break;


        /// Если искомый хост-объект - дерево узлов...
        case 'tree':
          me.hostLocator = function ()
          {
            /// Проверяем принципиальную возможность выполнения поиска визуального элемента,
            /// используем полученное значение при поиске хост-объекта...
            var canQuery = window['ZmlApp'] && window['ZmlApp'].VIEW && typeof window['ZmlApp'].VIEW.query === 'function';

            /// Получаем ссылку на основное представление, в котором расположены все визуальные элементы...
            var view = window['ZmlApp'].VIEW;

            /// Формируем универсальный селектор для поиска элемента по его itemId, равному текущему свойству hostId...
            var itemIdSelector = '[itemId=' + me.getHostId() + ']';

            /// Проверяем принципиальную возможность выполнения поиска типа this.up(...)
            var hasUpMethod = !!me.PLUGIN && !!me.PLUGIN.cmp && typeof me.PLUGIN.cmp.up === 'function';


            if (!!me.getHostId())
            {
              if (!!canQuery)
              {
                var query = view.query('CommonTree' + itemIdSelector);
                if (Array.isArray(query))
                {
                  return query[0];
                };
              };
            }
            else if (hasUpMethod)
            {
              return me.PLUGIN.cmp.up('CommonTree');
            };
          };
          break;



        /// Если искомый хост-объект - поле ввода данных...
        case 'input':
          me.hostLocator = function ()
          {
            /// Проверяем принципиальную возможность выполнения поиска визуального элемента,
            /// используем полученное значение при поиске хост-объекта...
            var canQuery = window['ZmlApp'] && window['ZmlApp'].VIEW && typeof window['ZmlApp'].VIEW.query === 'function';

            if (!!me.getHostId() && !!canQuery)
            {
              return window['ZmlApp'].LOC.Input[me.getHostId()];
            };
          };
          break;



        /// Если искомый хост-объект - комбобокс...
        case 'combo':
          me.hostLocator = function ()
          {
            /// Проверяем принципиальную возможность выполнения поиска визуального элемента,
            /// используем полученное значение при поиске хост-объекта...
            var canQuery = window['ZmlApp'] && window['ZmlApp'].VIEW && typeof window['ZmlApp'].VIEW.query === 'function';

            if (!!me.getHostId() && !!canQuery)
            {
              return window['ZmlApp'].LOC.Combo[me.getHostId()];
            };
          };
          break;



        /// Если искомый хост-объект - форма ввода данных...
        case 'form':
          me.hostLocator = function ()
          {
            /// Проверяем принципиальную возможность выполнения поиска визуального элемента,
            /// используем полученное значение при поиске хост-объекта...
            var canQuery = window['ZmlApp'] && window['ZmlApp'].VIEW && typeof window['ZmlApp'].VIEW.query === 'function';

            if (!!me.getHostId() && !!canQuery)
            {
              return window['ZmlApp'].LOC.Form[me.getHostId()];
            };
          };
          break;



        /// Если искомый хост-объект - редактор исходного кода...
        case 'codeeditor':
          me.hostLocator = function ()
          {
            /// Проверяем принципиальную возможность выполнения поиска визуального элемента,
            /// используем полученное значение при поиске хост-объекта...
            var canQuery = window['ZmlApp'] && window['ZmlApp'].VIEW && typeof window['ZmlApp'].VIEW.query === 'function';

            if (!!me.getHostId() && !!canQuery)
            {
              return window['ZmlApp'].LOC.CodeEditor[me.getHostId()];
            };
          };
          break;










        /// Для всех прочих типов хост-объектов...
        default:
          me.hostLocator = function ()
          {
            /// Проверяем принципиальную возможность выполнения поиска визуального элемента,
            /// используем полученное значение при поиске хост-объекта...
            var canQuery = window['ZmlApp'] && window['ZmlApp'].VIEW && typeof window['ZmlApp'].VIEW.query === 'function';

            /// Получаем ссылку на основное представление, в котором расположены все визуальные элементы...
            var view = window['ZmlApp'].VIEW;

            /// Формируем универсальный селектор для поиска элемента по его itemId, равному текущему свойству hostId...
            var itemIdSelector = '[itemId=' + me.getHostId() + ']';

            /// Проверяем принципиальную возможность выполнения поиска типа this.up(...)
            var hasUpMethod = !!me.PLUGIN && !!me.PLUGIN.cmp && typeof me.PLUGIN.cmp.up === 'function';



            if (!!me.getHostId())
            {
              if (!!canQuery)
              {
                var query = view.query(me.getHostType() + itemIdSelector);
                if (Array.isArray(query))
                {
                  return query[0];
                };
              };
            }
            else if (hasUpMethod)
            {
              return me.PLUGIN.cmp.up(me.getHostType());
            };
          };
          break;
      };

      setTimeout(function () { me.tryLocateHost(); }, 0);
    };
  },

  /**
   * Запускает метод hostLocator и записывает 
   * результаты его выполнения в свойство HOST.
   * После выполнения этих действий генерирует событие hostLocated.
   * Выполняется только в случае, если метод hostLocator 
   * уже проинициализирован и представляет из себя функцию.
   */
  tryLocateHost: function ()
  {
    var me = this;
    if (me.hostLocator !== null && typeof me.hostLocator === 'function')
    {
      me.HOST = me.hostLocator();
      setTimeout(function ()
      {
        if (!!me.HOST)
        {
          me.fireEvent('hostLocated', me);
        };
      }, 0)
    };
  },

  /**
   * Выполняет (ре)конфигурирование найденного хост-объекта:
   * удаляет из него имеющийся обработчик предыдущего (неактуального более) события hostEvent
   * и устанавливает новый обработчик текущего (актуального) события hostEvent.
   * В качестве метода-обработчика события хост-объекта используется локальный метод notifyContextManager.
   * Метод tryConfigureHost выполняется только в случае, если новое (актуальное) 
   * событие hostEvent не является falsy и хост-объект найден.
   * После выполнения всех описанных операций генерирует событие hostConfigured.
   * @param {any} oldevent Предыдущее событие hostEvent для удаления неактуального обработчика
   * @param {any} newevent Текущее событие hostEvent для установки актуального обработчика
   */
  tryConfigureHost: function (oldevent, newevent)
  {
    var me = this;
    if (!!newevent && me.HOST && oldevent != newevent)
    {
      if (!!oldevent)
      {
        me.HOST.un(oldevent, me.notifyContextManager, me);
      };
      me.HOST.on(newevent, me.notifyContextManager, me);

      me.fireEvent('hostConfigured', me, oldevent, newevent);
    };
  },

  /** 
   * Метод, принимающий управление дальнейшими операциями при получении
   * управляющего события от хост-объекта.
   * Генерирует событие executed с аргументами, полученными от события хост-объекта.
   */
  notifyContextManager: function ()
  {
    var me = this;
    me.fireEvent('executed', me, arguments);
  },





  /**
   * Обработчик события created.
   * Запускает инициализацию метода hostLocator.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   */
  OnCreated: function (ctx)
  {
    if (ctx && ctx.isContextBinder)
    {
      ctx.initHostLocator();
    };
  },

  /**
   * Обработчик события beforeDestroy.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   */
  OnBeforeDestroy: function (ctx)
  {
    if (ctx && ctx.isContextBinder && ctx.HOST && !!ctx.hostEvent)
    {
      ctx.HOST.un(ctx.hostEvent, ctx.notifyContextManager, ctx);
      ctx.setIsDetached(true);
    };
    return true;
  },

  /**
   * Обработчик события destroy.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   */
  OnDestroy: function (ctx)
  {
    console.dir(ctx.isDetached ? 'Successfully detached!' : 'Detach failed!');
  },

  /**
   * Обработчик события hostTypeChanged.
   * Выполняет сброс и повторную инициализацию метода hostLocator в случае,
   * если новое значение свойства hostType не является falsy.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   * @param {any} oldvalue Предыдущее значение свойства hostType
   * @param {any} newvalue Текущее значение свойства hostType
   */
  OnHostTypeChanged: function (ctx, oldvalue, newvalue)
  {
    if (ctx && ctx.isContextBinder)
    {
      if (oldvalue != newvalue && !!newvalue)
      {
        ctx.hostLocator = null;
        ctx.initHostLocator();
      };
    };
  },

  /**
   * Обработчик события hostIdChanged.
   * Запускает повторный поиск хост-объекта вызовом метода tryLocateHost в случае,
   * если новое значение свойства hostId не является falsy.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   * @param {any} oldvalue Предыдущее значение свойства hostId
   * @param {any} newvalue Текущее значение свойства hostId
   */
  OnHostIdChanged: function (ctx, oldvalue, newvalue)
  {
    if (ctx && ctx.isContextBinder)
    {
      if (oldvalue != newvalue && !!newvalue)
      {
        ctx.tryLocateHost();
      };
    };
  },

  /**
   * Обработчик события hostEventChanged.
   * Запускает реконфигурацию хост-объекта вызовом метода tryConfigureHost.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   * @param {any} oldvalue Предыдущее значение свойства hostEvent
   * @param {any} newvalue Текущее значение свойства hostEvent
   */
  OnHostEventChanged: function (ctx, oldvalue, newvalue)
  {
    if (ctx && ctx.isContextBinder)
    {
      ctx.tryConfigureHost(oldvalue, newvalue);
    };
  },

  /**
   * Обработчик события hostLocated.
   * Запускает реконфигурацию хост-объекта вызовом метода tryConfigureHost,
   * используя текущие значения свойств lastHostEvent и hostEvent как параметры его вызова
   * в качестве предыдущего и текущего значения свойства hostEvent соответственно.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   */
  OnHostLocated: function (ctx)
  {
    if (ctx && ctx.isContextBinder)
    {
      ctx.tryConfigureHost(ctx.lastHostEvent, ctx.hostEvent);
    };
  },

  /**
   * Обработчик события hostConfigured.
   * Устанавливает признак isHostConfigured равным true.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   */
  OnHostConfigured: function (ctx)
  {
    if (ctx && ctx.isContextBinder)
    {
      ctx.setIsHostConfigured(true);
    };
  },

  /**
   * Обработчик события executed.
   * Увеличивает счетчик применения изменений к управляемому элементу на единицу,
   * записывает полученные от управляющего события хост-объекта аргументы в свойство Summary.lastResult.
   * Событие executed далее используется в плагине, подключенном к управляемому элементу.
   * @param {any} ctx Конфигуратор привязки - экземпляр этого класса
   * @param {any} args Аргументы управляющего события хост-объекта
   */
  OnExecuted: function (ctx, args)
  {
    if (ctx && ctx.isContextBinder)
    {
      ctx.Summary.callsCount++;
      ctx.Summary.lastResult = [].concat(args);
    };
  },

});





/** Модель для источника данных ZmlApp.source.GetExpCategories */
Ext.define('ZmlApp.model.GetExpCategories', {
  extend: 'Zml.data.Model',
  idProperty: 'Id',
  fields: [
    { name: 'Id', type: 'int' },
    { name: 'Cat', type: 'string' },
    { name: 'ECount', type: 'int' },
    {
      name: 'ESum',
      type: 'int',
      serialize: function (v)
      {
        return Ext.util.Format.currency(v, '', 0, true);
      }
    },
    { name: 'Year', type: 'auto' },
    { name: 'Month', type: 'auto' },
    { name: 'Comments', type: 'string' }
  ]
});

/** Хранилище данных для фильтра по категориям затрат. */
Ext.define('ZmlApp.source.GetExpCategories', {
  extend: 'Zml.data.RestStore',
  model: 'ZmlApp.model.GetExpCategories',
  storeId: 'GetExpCategories',
  ObjectType: 'source',
  KEY: 'Id',
  autoLoad: true,
  autoDestroy: false,
  autoSync: true,
  pageSize: 20,
  Columns: {
    defaults: { filterable: true, sortable: true },
    items: []
  },
  paramLinkers: [
    new Zml.Param({ scopeId: 'YearsCombo', scopeType: 'combo', field: 'valueField', as: 'year' }),
    new Zml.Param({ scopeId: 'MonthsCombo', scopeType: 'combo', field: 'valueField', as: 'month' }),
    new Zml.Param({ scopeId: 'FilterComments', scopeType: 'input', as: 'comments' })
  ],
  proxy: { type: 'RESTProxy', idParam: 'Id', url: '/', path: 'Expenses/Exp/AggrCategories' }
});





/** Модель для источника данных ZmlApp.source.GetExpGroups */
Ext.define('ZmlApp.model.GetExpGroups', {
  extend: 'Zml.data.Model',
  idProperty: 'Id',
  fields: [
    { name: 'Id', type: 'int' },
    { name: 'Grp', type: 'string' },
    { name: 'ECount', type: 'int' },
    {
      name: 'ESum',
      type: 'int',
      serialize: function (v)
      {
        return Ext.util.Format.currency(v, '', 0, true);
      }
    },
    { name: 'Year', type: 'auto' },
    { name: 'Month', type: 'auto' },
    { name: 'Comments', type: 'string' }
  ]
});

/** Хранилище данных для фильтра по группам, входящим в категорию затрат. */
Ext.define('ZmlApp.source.GetExpGroups', {
  extend: 'Zml.data.RestStore',
  model: 'ZmlApp.model.GetExpGroups',
  storeId: 'GetExpGroups',
  ObjectType: 'source',
  KEY: 'Id',
  autoLoad: true,
  autoDestroy: false,
  autoSync: true,
  pageSize: 20,
  Columns: {
    defaults: { filterable: true, sortable: true },
    items: []
  },
  paramLinkers: [
    new Zml.Param({ scopeId: 'YearsCombo', scopeType: 'combo', field: 'valueField', as: 'year' }),
    new Zml.Param({ scopeId: 'MonthsCombo', scopeType: 'combo', field: 'valueField', as: 'month' }),
    new Zml.Param({ scopeId: 'FilterComments', scopeType: 'input', as: 'comments' })
  ],
  proxy: { type: 'RESTProxy', idParam: 'Id', url: '/', path: 'Expenses/Exp/AggrGroups' }
});





/** Модель для источника данных ZmlApp.source.GetEntriesYears */
Ext.define('ZmlApp.model.GetEntriesYears', {
  extend: 'Zml.data.Model',
  idProperty: 'Id',
  fields: [
    { name: 'Id', type: 'int' },
    { name: 'Year', type: 'string' },
    { name: 'ECount', type: 'int' },
    {
      name: 'ESum',
      type: 'int',
      serialize: function (v)
      {
        return Ext.util.Format.currency(v, '', 0, true);
      }
    },
    { name: 'Month', type: 'auto' },
    { name: 'Comments', type: 'string' }
  ]
});

/** Хранилище данных для актуального списка лет ведения журнала затрат. */
Ext.define('ZmlApp.source.GetEntriesYears', {
  extend: 'Zml.data.RestStore',
  model: 'ZmlApp.model.GetEntriesYears',
  storeId: 'GetEntriesYears',
  ObjectType: 'source',
  KEY: 'Id',
  autoLoad: true,
  autoDestroy: false,
  autoSync: true,
  pageSize: 20,
  Columns: {
    defaults: { filterable: true, sortable: true },
    items: []
  },
  paramLinkers: [
    new Zml.Param({ scopeId: 'MonthsCombo', scopeType: 'combo', field: 'valueField', as: 'month' }),
    new Zml.Param({ scopeId: 'FilterComments', scopeType: 'input', as: 'comments' })
  ],
  proxy: { type: 'RESTProxy', idParam: 'Id', url: '/', path: 'Expenses/Exp/AggrYears' }
});





/** Модель для источника данных ZmlApp.source.GetEntriesMonths */
Ext.define('ZmlApp.model.GetEntriesMonths', {
  extend: 'Zml.data.Model',
  idProperty: 'Id',
  fields: [
    { name: 'Id', type: 'int' },
    { name: 'Month', type: 'string' },
    { name: 'ECount', type: 'int' },
    {
      name: 'ESum',
      type: 'int',
      serialize: function (v)
      {
        return Ext.util.Format.currency(v, '', 0, true);
      }
    },
    { name: 'Year', type: 'auto' },
    { name: 'Comments', type: 'string' }
  ]
});

/** Хранилище данных для списка месяцев. */
Ext.define('ZmlApp.source.GetEntriesMonths', {
  extend: 'Zml.data.RestStore',
  model: 'ZmlApp.model.GetEntriesMonths',
  storeId: 'GetEntriesMonths',
  ObjectType: 'source',
  KEY: 'Id',
  autoLoad: true,
  autoDestroy: false,
  autoSync: true,
  pageSize: 20,
  Columns: {
    defaults: { filterable: true, sortable: true },
    items: []
  },
  paramLinkers: [
    new Zml.Param({ scopeId: 'YearsCombo', scopeType: 'combo', field: 'valueField', as: 'year' }),
    new Zml.Param({ scopeId: 'FilterComments', scopeType: 'input', as: 'comments' })
  ],
  proxy: { type: 'RESTProxy', idParam: 'Id', url: '/', path: 'Expenses/Exp/AggrMonths' }
});





/** Модель для источника данных ZmlApp.source.GetExpEntries */
Ext.define('ZmlApp.model.GetExpEntries', {
  extend: 'Zml.data.Model',
  idProperty: 'Id',
  fields: [
    { name: 'Id', type: 'int' },
    { name: 'Amount', type: 'float' },
    { name: 'Quantity', type: 'int' },
    { name: 'Date', type: 'date', dateFormat: 'c' },
    { name: 'Comment', type: 'string' },
    { name: 'GrpName', type: 'string' },
    { name: 'GrpId', type: 'int' }
  ]
});

/** Хранилище данных для журнала затрат. */
Ext.define('ZmlApp.source.GetExpEntries', {
  extend: 'Zml.data.RestStore',
  model: 'ZmlApp.model.GetExpEntries',
  storeId: 'GetExpEntries',
  ObjectType: 'source',
  KEY: 'Id',
  autoLoad: true,
  autoDestroy: false,
  autoSync: true,
  pageSize: 30,
  Columns: {
    defaults: { filterable: true, sortable: true },
    items: [
      { text: 'Сумма', dataIndex: 'Amount', xtype: 'numbercol', width: 120, format: '0.00', editor: { xtype: 'NumberField' } },
      { text: 'Дата', dataIndex: 'Date', xtype: 'datecol', width: 160, format: 'd.m.Y', editor: { xtype: 'DateField' }, plugins: [{ ptype: 'MonthFilteredColumn' }] },
      { text: 'Комментарий', dataIndex: 'Comment', flex: 1, editor: { xtype: 'TextField' } },
      { text: 'Группа', dataIndex: 'GrpName', width: 260, plugins: [{ ptype: 'ListFilteredColumn' }] }
    ]
  },
  paramLinkers: [
    new Zml.Param({ scopeId: 'YearsCombo', scopeType: 'combo', field: 'valueField', as: 'year' }),
    new Zml.Param({ scopeId: 'MonthsCombo', scopeType: 'combo', field: 'valueField', as: 'month' }),
    new Zml.Param({ scopeId: 'FilterComments', scopeType: 'input', as: 'comments' })
  ],
  proxy: { type: 'RESTProxy', idParam: 'Id', url: '/', path: 'Expenses/api/ExpEntries' },
  OnAfterWrite: function ()
  {
    ZmlApp.OnAfterEntrySaved();
  }
});





/** Модель для источника данных ZmlApp.source.GetEntryAutoGroups */
Ext.define('ZmlApp.model.GetEntryAutoGroups', {
  extend: 'Zml.data.Model',
  idProperty: 'Id',
  fields: [
    { name: 'Id', type: 'int' },
    { name: 'Name', type: 'string' },
    { name: 'CatId', type: 'int' }
  ]
});

/** Хранилище данных для автоматически предложенной группы затрат. */
Ext.define('ZmlApp.source.GetEntryAutoGroups', {
  extend: 'Zml.data.RestStore',
  model: 'ZmlApp.model.GetEntryAutoGroups',
  storeId: 'GetEntryAutoGroups',
  ObjectType: 'source',
  KEY: 'Id',
  autoLoad: false,
  autoDestroy: false,
  autoSync: true,
  pageSize: 1,
  Columns: {
    defaults: { filterable: true, sortable: true },
    items: []
  },
  paramLinkers: [
    new Zml.Param({ scopeId: 'EntryComment', scopeType: 'input', as: 'comments' })
  ],
  proxy: { type: 'RESTProxy', idParam: 'Id', url: '/', path: 'Expenses/Exp/EntryAutoGroups' },
  OnAfterLoad: function ()
  {
    ZmlApp.OnAfterAutoGroups();
  }
});





/** Модель для источника данных ZmlApp.source.GetCommentAutoComplete */
Ext.define('ZmlApp.model.GetCommentAutoComplete', {
  extend: 'Zml.data.Model',
  idProperty: 'Id',
  fields: [
    { name: 'Id', type: 'string' },
    { name: 'Name', type: 'string' }
  ]
});

/**  */
Ext.define('ZmlApp.source.GetCommentAutoComplete', {
  extend: 'Zml.data.RestStore',
  model: 'ZmlApp.model.GetCommentAutoComplete',
  storeId: 'GetCommentAutoComplete',
  ObjectType: 'source',
  KEY: 'Id',
  autoLoad: true,
  autoDestroy: false,
  autoSync: true,
  pageSize: 200,
  Columns: {
    defaults: { filterable: true, sortable: true },
    items: []
  },
  proxy: { type: 'RESTProxy', idParam: 'Id', url: '/', path: 'Expenses/Exp/CommentAutoComplete' }
});





/** Модель для источника данных ZmlApp.source.AllGroups */
Ext.define('ZmlApp.model.AllGroups', {
  extend: 'Zml.data.Model',
  idProperty: 'Id',
  fields: [
    { name: 'Id', type: 'int' },
    { name: 'Name', type: 'string' },
    { name: 'GrpName', type: 'string', mapping: 'Name' }
  ]
});

/** Хранилище данных для комбобокса-редактора поля (Группа затрат) */
Ext.define('ZmlApp.source.AllGroups', {
  extend: 'Zml.data.RestStore',
  model: 'ZmlApp.model.AllGroups',
  storeId: 'AllGroups',
  ObjectType: 'source',
  KEY: 'Id',
  autoLoad: true,
  autoDestroy: false,
  autoSync: true,
  pageSize: 1000,
  Columns: {
    defaults: { filterable: true, sortable: true },
    items: []
  },
  proxy: { type: 'RESTProxy', idParam: 'Id', url: '/', path: 'Expenses/Exp/AllGroups' }
});










/**  */
Ext.define('ZmlApp.action.CalcAutoGroups', {
  extend: 'Zml.data.RestStore',
  fields: [],
  storeId: 'CalcAutoGroups',
  __storeid: 'CalcAutoGroups',
  ObjectType: 'action',
  proxy: { type: 'RESTProxy', url: '/', path: 'Expenses/Exp/CalcAutoGroups' },
  paramLinkers: [],
  OnAfterLoad: function ()
  {
    Ext.getStore('GetExpEntries').load();
  }
});
/**  */
Ext.define('ZmlApp.action.RecalcAutoGroup', {
  extend: 'Zml.data.RestStore',
  fields: [],
  storeId: 'RecalcAutoGroup',
  __storeid: 'RecalcAutoGroup',
  ObjectType: 'action',
  proxy: { type: 'RESTProxy', url: '/', path: 'Expenses/Exp/RecalcAutoGroup' },
  paramLinkers: [
    new Zml.Param({ scopeId: 'EntriesGrid', scopeType: 'grid', field: 'Id' })
  ],
  OnAfterLoad: function ()
  {
    Ext.getStore('GetExpEntries').load();
  }
});
/**  */
Ext.define('ZmlApp.action.SaveSerializedXML', {
  extend: 'Zml.data.RestStore',
  fields: [],
  storeId: 'SaveSerializedXML',
  __storeid: 'SaveSerializedXML',
  ObjectType: 'action',
  proxy: { type: 'RESTProxy', url: '/', path: 'Expenses/Exp/SaveToXml' },
  paramLinkers: []
});
/**  */
Ext.define('ZmlApp.action.SaveSerializedEmptyXML', {
  extend: 'Zml.data.RestStore',
  fields: [],
  storeId: 'SaveSerializedEmptyXML',
  __storeid: 'SaveSerializedEmptyXML',
  ObjectType: 'action',
  proxy: { type: 'RESTProxy', url: '/', path: 'Expenses/Exp/SaveToEmptyXml' },
  paramLinkers: []
});





/** Класс основного представления приложения. */
Ext.define('ZmlApp.view.App', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.AppViewport',
  itemId: 'AppViewport',
  layout: 'vbox',
  border: 0,
  bodyBorder: 0,
  padding: 15,
  width: '100%',
  height: '100%',
  items: [
    {
      xtype: 'form',
      itemId: 'NewEntryForm',
      title: 'НОВАЯ ЗАПИСЬ',
      width: '100%',
      height: 140,
      maxHeight: 140,
      bodyBorder: 0,
      bodyPadding: 10,
      layout: 'column',
      fieldDefaults: { margin: '0 10 0 0', labelAlign: 'top', labelWidth: 55 },
      columnWidth: 1,
      plugins: [{ ptype: 'ColorManager', titleColor: 'black', titleBackColor: 'cleargrey', bodyBackColor: 'palegrey' }],
      items: [
        {
          xtype: 'DateField',
          fieldLabel: 'Дата',
          itemId: 'EntryDate',
          name: 'EntryDate',
          format: 'd.m.Y',
          submitFormat: 'd.m.Y',
          startDay: 1,
          allowBlank: false,
          msgTarget: 'side',
          columnWidth: 0.1,
          anchor: '100%',
          submitEmptyText: false,
          autoSync: false,
          plugins: []
        },
        {
          xtype: 'NumberField',
          fieldLabel: 'Кол-во',
          itemId: 'EntryQuantity',
          name: 'EntryQuantity',
          value: 1,
          minValue: 1,
          allowBlank: false,
          msgTarget: 'side',
          columnWidth: 0.06,
          anchor: '100%',
          submitEmptyText: false,
          autoSync: false,
          plugins: []
        },
        {
          xtype: 'NumberField',
          fieldLabel: 'Сумма',
          itemId: 'EntryAmount',
          name: 'EntryAmount',
          decimalPrecision: 2,
          allowBlank: false,
          msgTarget: 'side',
          columnWidth: 0.12,
          anchor: '100%',
          submitEmptyText: false,
          autoSync: false,
          plugins: []
        },
        {
          xtype: 'ComboBox',
          fieldLabel: 'Комментарий',
          itemId: 'EntryComment',
          displayField: 'Name',
          valueField: 'Id',
          store: 'GetCommentAutoComplete',
          fieldCls: 'x-form-field basecombo no-trigger',
          editable: true,
          forceSelection: false,
          hideTrigger: true,
          minChars: 2,
          required: true,
          anchor: '100%',
          labelWidth: 100,
          columnWidth: 0.5,
          TEMPLATE: ['<ul class="x-list-plain">', '<tpl for=".">', '<li role="option" class="x-boundlist-item combo-item">', '<div class="first-line">', '<p class="left-side">{Name}</p>', '</div>', '</li>', '</tpl>', '</ul>'],
          ApiOnChange: function ()
          {
            ZmlApp.CallEntryAutoGroups();
          }
        },
        {
          xtype: 'TextField',
          fieldLabel: 'Группа',
          itemId: 'EntryGroup',
          name: 'EntryGroup',
          labelWidth: 100,
          readOnly: true,
          msgTarget: 'side',
          columnWidth: 0.22,
          anchor: '100%',
          submitEmptyText: false,
          autoSync: false,
          plugins: []
        }
      ],
      dockedItems: [
        {
          xtype: 'toolbar',
          dock: 'bottom',
          items: [
            {
              xtype: 'Button',
              itemId: 'SomeButton',
              text: 'СОХРАНИТЬ',
              call: 'action',
              targetId: 'SaveNewEntry',
              iconSet: 'mat-icons',
              disabled: true,
              plugins: [{
                  ptype: 'HostContext',
                  pluginId: 'SomeButton-hostContextPlugin',
                  CTX_BINDERS: [
                    {
                      hostType: 'form',
                      hostId: 'NewEntryForm',
                      hostEvent: 'validitychange'
                    }
                  ]
                }, {
                  ptype: 'Ripple',
                  pluginId: 'SomeButton-ripplePlugin'
                }],
              OnHandlerCall: function ()
              {
                ZmlApp.SaveNewEntry();
              }
            }
          ]
        }
      ]
    },
    { xtype: 'splitter', collapseTarget: 'next', size: 10, overCls: 'x-splitter-over' },
    {
      xtype: 'CommonGrid',
      itemId: 'EntriesGrid',
      title: 'ЖУРНАЛ',
      flex: 1,
      selModel: { selType: 'checkboxmodel', allowDeselect: true, mode: 'MULTI' },
      store: 'GetExpEntries',
      viewConfig: { },
      features: [{ ftype: 'filters', encode: true }],
      plugins: [{ ptype: 'ColorManager', titleColor: 'white', titleBackColor: 'darkbrown', bodyBackColor: 'white' }, { ptype: 'GridEditor' }, { ptype: 'rowediting', pluginId: 'cedit', clicksToEdit: 2 }],
      columns: {
        defaults: { filterable: true, sortable: true },
        items: [
          { text: 'Сумма', dataIndex: 'Amount', xtype: 'numbercol', width: 120, format: '0.00', editor: { xtype: 'NumberField' } },
          { text: 'Дата', dataIndex: 'Date', xtype: 'datecol', width: 160, format: 'd.m.Y', editor: { xtype: 'DateField' }, plugins: [{ ptype: 'MonthFilteredColumn' }] },
          { text: 'Комментарий', dataIndex: 'Comment', flex: 1, editor: { xtype: 'TextField' } },
          { text: 'Группа', dataIndex: 'GrpName', width: 260, plugins: [{ ptype: 'ListFilteredColumn' }] }
        ]
      },
      dockedItems: [
        {
          xtype: 'toolbar',
          dock: 'top',
          items: [
            {
              xtype: 'Button',
              itemId: 'CalcGroupsBtn',
              text: 'АВТОРАЗНЕСЕНИЕ ЗАТРАТ',
              call: 'action',
              targetId: 'CalcAutoGroups',
              iconSet: 'mat-icons',
              disabled: true,
              plugins: [{
                  ptype: 'HostContext',
                  pluginId: 'CalcGroupsBtn-hostContextPlugin',
                  CTX_BINDERS: [
                    {
                      hostType: 'input',
                      hostId: 'EntryAmount',
                      hostEvent: 'validitychange'
                    }
                  ]
                }, {
                  ptype: 'Ripple',
                  pluginId: 'CalcGroupsBtn-ripplePlugin'
                }],
              OnHandlerCall: function ()
              {
                Ext.StoreManager.ACTION('CalcAutoGroups')[0].load();
              }
            },
            { xtype: 'tbseparator', margin: '0 3' },
            {
              xtype: 'Button',
              itemId: 'SaveToXmlBtn',
              text: 'ВЫГРУЗКА В XML (ПОЛНАЯ)',
              call: 'action',
              targetId: 'SaveSerializedXML',
              iconSet: 'mat-icons',
              disabled: false,
              plugins: [{
                  ptype: 'Ripple',
                  pluginId: 'SaveToXmlBtn-ripplePlugin'
                }],
              OnHandlerCall: function ()
              {
                Ext.StoreManager.ACTION('SaveSerializedXML')[0].load();
              }
            },
            {
              xtype: 'Button',
              itemId: 'SaveToEmptyXmlBtn',
              text: 'ВЫГРУЗКА В XML (ПРАВИЛА)',
              call: 'action',
              targetId: 'SaveSerializedEmptyXML',
              iconSet: 'mat-icons',
              disabled: false,
              plugins: [{
                  ptype: 'Ripple',
                  pluginId: 'SaveToEmptyXmlBtn-ripplePlugin'
                }],
              OnHandlerCall: function ()
              {
                Ext.StoreManager.ACTION('SaveSerializedEmptyXML')[0].load();
              }
            },
            { xtype: 'tbseparator', margin: '0 3' },
            {
              xtype: 'Button',
              itemId: 'RecalcGroupBtn',
              text: 'ОБНОВИТЬ ГРУППУ ЗАТРАТ',
              call: 'action',
              targetId: 'RecalcAutoGroup',
              iconSet: 'mat-icons',
              disabled: true,
              needSelection: 'single',
              plugins: [{
                  ptype: 'HostContext',
                  pluginId: 'RecalcGroupBtn-hostContextPlugin',
                  CTX_BINDERS: [
                    {
                      hostType: 'grid',
                      hostEvent: 'selectionchange',
                      needSelection: 'single'
                    }
                  ]
                }, {
                  ptype: 'Ripple',
                  pluginId: 'RecalcGroupBtn-ripplePlugin'
                }],
              OnHandlerCall: function ()
              {
                Ext.StoreManager.ACTION('RecalcAutoGroup')[0].load();
              }
            }
          ]
        },
        { xtype: 'paging', store: 'GetExpEntries', defaultpagesize: 30, enableCreateButton: true }
      ]
    }
  ]
});




/** Класс контроллера приложения. */
Ext.define('ZmlApp.controller.Main', {
  extend: 'Ext.app.Controller',
  models: ['ZmlApp.model.GetExpCategories', 'ZmlApp.model.GetExpGroups', 'ZmlApp.model.GetEntriesYears', 'ZmlApp.model.GetEntriesMonths', 'ZmlApp.model.GetExpEntries', 'ZmlApp.model.GetEntryAutoGroups', 'ZmlApp.model.GetCommentAutoComplete', 'ZmlApp.model.AllGroups'],
  init: function ()
  {
    this.initStores();
    this.initView();
  },
  initView: function ()
  {
    this.Viewport = Ext.create('ZmlApp.view.App', { renderTo: Ext.get('mainContainer') });
  },
  initStores: function ()
  {
    Ext.create('ZmlApp.source.GetExpCategories', { storeId: 'GetExpCategories' });
    Ext.create('ZmlApp.source.GetExpGroups', { storeId: 'GetExpGroups' });
    Ext.create('ZmlApp.source.GetEntriesYears', { storeId: 'GetEntriesYears' });
    Ext.create('ZmlApp.source.GetEntriesMonths', { storeId: 'GetEntriesMonths' });
    Ext.create('ZmlApp.source.GetExpEntries', { storeId: 'GetExpEntries' });
    Ext.create('ZmlApp.source.GetEntryAutoGroups', { storeId: 'GetEntryAutoGroups' });
    Ext.create('ZmlApp.source.GetCommentAutoComplete', { storeId: 'GetCommentAutoComplete' });
    Ext.create('ZmlApp.source.AllGroups', { storeId: 'AllGroups' });
    Ext.create('ZmlApp.action.CalcAutoGroups', { storeId: 'CalcAutoGroups' });
    Ext.create('ZmlApp.action.RecalcAutoGroup', { storeId: 'RecalcAutoGroup' });
    Ext.create('ZmlApp.action.SaveSerializedXML', { storeId: 'SaveSerializedXML' });
    Ext.create('ZmlApp.action.SaveSerializedEmptyXML', { storeId: 'SaveSerializedEmptyXML' });
  }
});




Ext.application({
  name: 'ZmlApp',
  controllers: ['ZmlApp.controller.Main'],
  launch: function ()
  {
    ZmlApp = this;
    ZmlApp.CTRL = this.getController('ZmlApp.controller.Main');
    ZmlApp.VIEW = ZmlApp.CTRL.Viewport;
    window.onresize = function ()
    {
      ZmlApp.VIEW.doLayout();
    };
    ZmlApp.LOC = {
      Input: {
        EntryDate: ZmlApp.VIEW.query('DateField[itemId=EntryDate]')[0],
        EntryQuantity: ZmlApp.VIEW.query('NumberField[itemId=EntryQuantity]')[0],
        EntryAmount: ZmlApp.VIEW.query('NumberField[itemId=EntryAmount]')[0],
        EntryGroup: ZmlApp.VIEW.query('TextField[itemId=EntryGroup]')[0]
      },
      Combo: {
        EntryComment: ZmlApp.VIEW.query('combobox[itemId=EntryComment]')[0]
      },
      List: {
      },
      Grid: {
        EntriesGrid: ZmlApp.VIEW.query('CommonGrid[itemId=EntriesGrid]')[0]
      },
      Tree: {
      },
      Form: {
        NewEntryForm: ZmlApp.VIEW.query('form[itemId=NewEntryForm]')[0]
      },
      Button: {
        SomeButton: ZmlApp.VIEW.query('Button[itemId=SomeButton]')[0],
        CalcGroupsBtn: ZmlApp.VIEW.query('Button[itemId=CalcGroupsBtn]')[0],
        SaveToXmlBtn: ZmlApp.VIEW.query('Button[itemId=SaveToXmlBtn]')[0],
        SaveToEmptyXmlBtn: ZmlApp.VIEW.query('Button[itemId=SaveToEmptyXmlBtn]')[0],
        RecalcGroupBtn: ZmlApp.VIEW.query('Button[itemId=RecalcGroupBtn]')[0]
      },
      Panel: {
      },
      Tabpanel: {
      },
      CheckList: {
      },
      CodeEditor: {
      },
      PortalColumn: {
      },
      Portlet: {
      }
    };
    ZmlApp.SRC = {
      GetExpCategories: Ext.getStore('GetExpCategories'),
      GetExpGroups: Ext.getStore('GetExpGroups'),
      GetEntriesYears: Ext.getStore('GetEntriesYears'),
      GetEntriesMonths: Ext.getStore('GetEntriesMonths'),
      GetExpEntries: Ext.getStore('GetExpEntries'),
      GetEntryAutoGroups: Ext.getStore('GetEntryAutoGroups'),
      GetCommentAutoComplete: Ext.getStore('GetCommentAutoComplete'),
      AllGroups: Ext.getStore('AllGroups')
    };
    Ext.StoreManager.AutoloadSources();
    ZmlApp.CallEntryAutoGroups = function ()
    {
      Ext.getStore('GetEntryAutoGroups').load();
    };
    ZmlApp.OnAfterAutoGroups = function ()
    {
      ZmlApp.LOC.Input.EntryGroup.setValue(Ext.StoreManager.SOURCE('GetEntryAutoGroups')[0].GetRecordField('Name', 0));
    };
    ZmlApp.SaveNewEntry = function ()
    {
      Ext.StoreManager.SAVENEWRECORD('GetExpEntries', 
      [
        new Zml.Param({ as: 'Id', value: '0' }),
        new Zml.Param({ scopeId: 'EntryAmount', scopeType: 'input', as: 'Amount' }),
        new Zml.Param({ scopeId: 'EntryQuantity', scopeType: 'input', as: 'Quantity' }),
        new Zml.Param({ scopeId: 'EntryDate', scopeType: 'input', as: 'Date' }),
        new Zml.Param({ scopeId: 'EntryComment', scopeType: 'input', as: 'Comment' }),
        new Zml.Param({ as: 'GrpId', value: '0' }),
        new Zml.Param({ as: 'GrpName', value: '' })
      ]);
    };
    ZmlApp.OnAfterEntrySaved = function ()
    {
      ZmlApp.LOC.Input.EntryAmount.clearField();
      ZmlApp.VIEW.query('combobox[itemId=EntryComment]')[0].clearField();
      ZmlApp.LOC.Input.EntryQuantity.clearField();
      Ext.getStore('GetExpCategories').load();
      Ext.getStore('GetExpGroups').load();
    };
  }
});
