'use strict';
'require form';
'require fs';
'require view';

return view.extend({
	load: function() {
		return Promise.all([
			L.resolveDefault(fs.read_direct('/sys/devices/system/cpu/cpufreq/policy0/scaling_available_governors'), ''),
			L.resolveDefault(fs.read_direct('/sys/devices/system/cpu/cpufreq/policy0/scaling_available_frequencies'), ''),
			L.resolveDefault(fs.read_direct('/sys/devices/system/cpu/cpufreq/policy0/scaling_governor'), ''),
			L.resolveDefault(fs.read_direct('/sys/devices/system/cpu/cpufreq/ondemand/up_threshold'), '50'),
			L.resolveDefault(fs.read_direct('/sys/devices/system/cpu/cpufreq/ondemand/sampling_rate'), '10'),
			L.resolveDefault(fs.read_direct('/sys/devices/system/cpu/cpufreq/policy0/scaling_min_freq'), ''),
			L.resolveDefault(fs.read_direct('/sys/devices/system/cpu/cpufreq/policy0/scaling_max_freq'), '')
		]);
	},

	render: function(results) {
		let governors = results[0].replace(/[\r\n]/g,"").trim().split(" ");
		let frequency = results[1].replace(/[\r\n]/g,"").trim().split(" ");
		
		var m, s, o;
		m = new form.Map('cpufreq', _('Kernel Manager'), _('Kernel manager is an application which manages kernel parameters.'));

		s = m.section(form.NamedSection, 'settings');
		s.addremove = false;

		o = s.option(form.ListValue, 'governor', _('CPU Governor'), _('The CPU governor determines how the CPU behaves in workload.'));
		governors.forEach(function(value){ o.value(value); });
		o.cfgvalue = function() { return results[2].replace(/[\r\n]/g,""); }

		o = s.option(form.Value, 'upthreshold', _('CPU Switching Threshold'), _('Set the threshold for stepping up to another frequency.'));
		o.datatype = 'range(1,99)';
		o.depends('governor', 'ondemand');
		o.cfgvalue = function() { return results[3].replace(/[\r\n]/g,""); }

		o = s.option(form.Value, 'factor', _('CPU Sampling rate'), _('Set the frequency(ms) which governor checks to tune the CPU'));
		o.datatype = 'range(1,100000)';
		o.depends('governor', 'ondemand');
		o.cfgvalue = function() { return results[4].replace(/[\r\n]/g,""); }

		o = s.option(form.ListValue, 'minfreq', _('CPU Minimum Frequency'), _('Set the minimum frequency the CPU scales down to.'));
		frequency.forEach(function(value){ o.value(value); });
		o.cfgvalue = function() { return results[5].replace(/[\r\n]/g,""); }


		o = s.option(form.ListValue, 'maxfreq', _('CPU Maximum Frequency'), _('Set the maximum frequency the CPU scales up to.'));
		frequency.forEach(function(value){ o.value(value); });
		o.cfgvalue = function() { return results[6].replace(/[\r\n]/g,""); }

		return m.render();
	}
});
