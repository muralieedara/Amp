angular.module('directives',[])
	.directive('highlightRow',function(){
		var linker = function(s,e,a){
			e.bind('mouseover',function(event){
				event.stopPropagation();
				$(this).addClass('hover');
			});
			e.bind('mouseout',function(event){
				$(this).removeClass('hover');
			});
		};
		return{
			link:linker
		}
	});