$(function()
{
    var color_td     = $(".color_td.active");
    var cell_values  = new Array();
    var templates_td = $("#templates_td");

    $(".rt_checkbox").each(function()
    {
        $(this).attr("checked", false);
    });

    $.post
    (
        "/diagnostic_table/data",
        {'YUPE_TOKEN':csrfToken},
        function(result)
        {
        	var systems = result.data;
            color_td.each(function()
            {
                var cell = parseInt($(this).attr("cell"));
                var msg = systems[cell-1].name;

                $(this).bt(msg, {
                    positions: 'top',
                    fill: 'white'
                });
            })

            $("#result_button").click(function()
            {
                templates_td.html("");

                for (cell in cell_values)
                {
                    var s_tpl      = $("#s_tpl").html();
                    var cell_value = cell_values[cell];
                    var system     = systems[cell-1];

                    for (system_value in system.values)
                    {
                        eval("var res = " + cell_value + system.values[system_value] + ";");

                        if (res)
                        {
                            s_tpl = s_tpl.replace("{SYSTEM_VALUE}", system_value);
                            s_tpl = s_tpl.replace("{RU_VALUE}", ru_system_values[system_value]);

                            //console.log(system.name);
                            //console.log("cell_value: " + cell_value);
                            //console.log("var res = " + cell_value + system.values[system_value] + ";");
                            //console.log(res);
                            break;
                        }
                    }

                    var product_link = "&nbsp; <a href='/catalog?category_id=bad&category%5B%5D=" + system.category + "' class='products_link' target='_blank'>продукция</a>";

                    s_tpl = s_tpl.replace("{NAME}", system.name);
                    s_tpl = s_tpl.replace("{TEXT}", system.description);
                    s_tpl = s_tpl.replace("{ICON}", system.icon);
                    s_tpl = s_tpl.replace("{SYSTEM_ID}", system.id);
                    s_tpl = s_tpl.replace("{PRODUCT_LINK}", product_link);

                    templates_td.append(s_tpl);
                }

                initProductsLinks();

                location.href="#result";
            });
        },
        "json"
    );

    for (var i = 1; i <= 9; i++)
    {
        cell_values[i] = 0;    
    }

    $(".rt_checkbox").click(function()//,.label_td
    {
        templates_td.html("");

        var checkbox = $(this);
        var checked = checkbox.is(':checked');

        checkbox.parents("tr:eq(0)").find(".color_td").each(function()
        {
            var bgcolor = $(this).attr("bgcolor");
            var cell    = $(this).attr("cell");
            if (isNaN(cell_values[cell]))
            {
                cell_values[cell] = 0;
            }

            if (bgcolor == "white")
            {
                if (checked)
                {
                    cell_values[cell]++;
                    $(this).addClass("selected");
                }
                else
                {
                    cell_values[cell]--;
                    $(this).removeClass("selected");
                }
            }
        });

        calculateResult();
    });


    color_td.mouseover(function()
    {
        clearColorTdBorders();
        var cur_cell = $(this).attr("cell");
        var lines_count = 48;
        var index = 0;
        color_td.each(function()
        {
            var cell = $(this).attr("cell");

            if (cell == cur_cell)
            {
                if (index == 0)
                {
                    $(this).css("border-top", "1px solid gray");
                }

                if (index == (lines_count - 1))
                {
                    $(this).css("border-bottom", "1px solid gray");
                }

                $(this).css("border-left", "1px solid gray");
                $(this).css("border-right", "1px solid gray");

                index++;
            }
        });
    });


    color_td.mouseout(function()
    {
        $(".bt-wrapper").remove();
        clearColorTdBorders();
    });


    function clearColorTdBorders()
    {
        color_td.each(function()
        {
        	$(this).attr("style", null);
        });
    }


    function calculateResult()
    {
        for (var index in cell_values)
        {
            $("#cell_" + index).html(cell_values[index]);
        }
    }
});

var ru_system_values = {
    very_good : "<span style='color:#557F03'>Очень хорошо</span>",
    good      : "<span style='color:#475C1D'>Хорошо</span>",
    normal    : "<span style='color:#5C98E2'>Удовлетворительно</span>",
    bad       : "<span style='color:#E93310'>Неудовлетворительно</span>"
}


function initProductsLinks()
{
    var system_products_div = $(".system_products_div");
}