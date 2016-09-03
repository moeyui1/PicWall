/**
 * Created by moeyui on 2016/8/10 0010.
 */

function loadImg() {
    // console.log('loaded')
    // var gridItemList = $('.natural')
    // gridItemList.each(function (index, value) {
    //     // console.log(index,'--',value)
    //     console.log(gridItemList.eq(index).width())
    // })
    var $grid = $('.grid').imagesLoaded(function () {
        $grid.masonry({
            // options
            itemSelector: '.grid-item',
            columnWidth: 250
        });
    })

}
